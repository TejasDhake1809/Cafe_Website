import Order from '../model/orderModel.js';
import Product from '../model/productModel.js';
import Apriori from 'node-apriori';
import { generateInvoice } from "../invoice/invoicegenerator.js";
import path from "path";
import fs from "fs";

// orderController.js

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");
    if (!order) return res.status(404).json({ error: "Order not found" });

    const invoicesDir = path.resolve("./invoices");
    // ✅ Ensure invoices folder exists
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filePath = path.join(invoicesDir, `invoice_${order._id}.pdf`);
    generateInvoice(order, filePath);

    // Wait for file to be written before sending
    setTimeout(() => {
      res.download(filePath);
    }, 1000);

  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: error.message });
  }
};


const getOrders = async (req,res) => {
    try {
        const { field, value, limit } = req.query; 
        const sortField = field || 'createdAt';
        const sortValue = Number(value) || -1;
        const orders = await Order.find().sort({[sortField] : sortValue}).limit(Number(limit) || 0);
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}

const updateOrderStatus = async (req,res) => {
    try {
        console.log("PATCH /update-status/:id called with id:", req.params.id, "body:", req.body);
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, 
            {delivery_status : req.body.delivery_status}, {new : true});
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getOrdersUserDashboard = async (req,res) => {
    try {
        const { email } = req.query; 
        const orders = await Order.find({email}).sort({createdAt : -1});
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
}

const getBarChartStats = async (req,res) => {
    try {
        const now = new Date();
        let result = [];
        let labels = [];

        for (let i = 5; i>=0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const next = new Date(now.getFullYear(), date.getMonth()+1, 1);
            const label = date.toLocaleString('default', {month : 'short'});

            labels.push(label);
            result.push({
                startDate : date,
                endDate : next
            })
        }

        const revenue = await Promise.all(
            result.map(async (item)=> {
                const orders = await Order.find({createdAt : {$gte : item.startDate, $lt : item.endDate}});
                return orders.reduce((sum,element) => sum + element.price, 0);
            })
        ) 
        return res.status(200).json({label : labels, revenue});
        
    } catch (error) {
       return res.status(400).json({error : error.message});
    }
}

const getPieChartStats = async (req,res) => {
    try {
        const products = await Product.find();

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        startDate.setHours(0,0,0,0);
        const orders = await Order.find({createdAt : {$gte : startDate}});
        //issue with the way we store ordered items
        let starters = 0;
        let maincourse = 0;
        let dessert = 0;
        let drinks = 0;
        orders.forEach(order => {
            if (order.items && order.items.counts) {
                Object.entries(order.items.counts).forEach(([productId, count]) => {
                const prod = products.find(item => item._id.toString() === productId);
                const category = prod.category;
                if (category === "Starters") starters+=prod.price*count
                else if (category === "Main Course") maincourse+=prod.price*count
                else if (category === "Dessert") dessert+=prod.price*count
                else if (category === "Drinks") drinks+=prod.price*count
            })
            }
            
        })
        let total = starters + maincourse + dessert + drinks;
        let starterspercent = (starters/total)*100;
        let maincoursepercent = (maincourse/total)*100;
        let dessertpercent = (dessert/total)*100;
        let drinkspercent = (drinks/total)*100;
        starterspercent = starterspercent.toFixed(2);
        maincoursepercent = maincoursepercent.toFixed(2);
        dessertpercent = dessertpercent.toFixed(2);
        drinkspercent = drinkspercent.toFixed(2);

        res.status(200).json({starterspercent,maincoursepercent,dessertpercent,drinkspercent});
    } catch (error) {
        res.status(400).json({error : error.message});
    }
}

const getDataAnalytics = async (req,res) => {
    try {
        const {timeframe} = req.query;
        const now = new Date();
        let startDate;

        //date logic
        if (timeframe === "Today"){
            startDate = new Date();
            startDate.setHours(0,0,0,0); //Midnight today
        } else if (timeframe === "Weekly") {
            const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
            const diff = now.getDate() - day + (day === 0 ? -6 : 1); // go back to Monday
            startDate = new Date(now); // copy current date
            startDate.setDate(diff);   // set to Monday
            startDate.setHours(0,0,0,0);
        } else if (timeframe === "Monthly") {
            startDate = new Date (now.getFullYear(), now.getMonth(), 1); //get year (2025), then get month (0-12), get first day of month
            startDate.setHours(0,0,0,0); //midnight to first day of the month
        } else {
            startDate = null;
        }

        //set filter
        const filter = startDate ? { createdAt : {$gte: startDate}} : {};
        const orders = await Order.find(filter);
        //getting unique emails (my O(N^2) logic)
        // const uniqueEmails = await Order.distinct("email");
        // const totalCustomers = uniqueEmails.length;
        // uniqueEmails.forEach((item) => {
        //     let count = 0;
        //     orders.forEach((order) => {
        //         if (item === order.email) {
        //             count+=1;
        //         }
        //     })
        //     if (count > 1)
        //         repeatCustomers+=1;
        // })

        // O(N) time with O(N) space
        let emailCounts = {};
        let totalItemsOrdered = 0;

        let online = 0;
        let cash = 0;

        orders.forEach((order) => {
            order.payment_type === 'cash' ? cash+=1 : online +=1;
            totalItemsOrdered += Object.values(order.items.counts).reduce((sum, val) => sum + val, 0);
            emailCounts[order.email] = (emailCounts[order.email] || 0 ) + 1;
        })

        let newCustomers = 0;
        await Promise.all(
            orders.map(async (order) => {
            const record = await Order.findOne({email : order.email}).sort({createdAt : 1});
            if (record && record.createdAt.getTime() === order.createdAt.getTime())
                newCustomers += 1;
        })
        )

        online = (online/(orders.length))*100;
        cash = (cash/(orders.length))*100;
        online = online.toFixed(2);
        cash = cash.toFixed(2);

        let averageItemsOrdered = totalItemsOrdered/(orders.length);
        averageItemsOrdered = averageItemsOrdered.toFixed(2);

        const totalCustomers = Object.keys(emailCounts).length;
        const repeatCustomers = Object.values(emailCounts).filter(count => count > 1).length;

        let repeatPercent = totalCustomers === 0 ? 0 : (repeatCustomers/totalCustomers)*100;
        repeatPercent = repeatPercent.toFixed(2);
        return res.status(200).json({repeatPercent, newCustomers, averageItemsOrdered, online, cash});

    } catch (error) {
        return res.status(500).json({error : error.message});
    }
}

const getOrderStats = async (req,res) => {
    try {
        const {timeframe} = req.query;
        const now = new Date();
        let startDate;

        //date logic
        if (timeframe === "Today"){
            startDate = new Date();
            startDate.setHours(0,0,0,0); //Midnight today
        } else if (timeframe === "Weekly") {
            const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
            const diff = now.getDate() - day + (day === 0 ? -6 : 1); // go back to Monday
            startDate = new Date(now); // copy current date
            startDate.setDate(diff);   // set to Monday
            startDate.setHours(0,0,0,0);
        } else if (timeframe === "Monthly") {
            startDate = new Date (now.getFullYear(), now.getMonth(), 1); //get year (2025), then get month (0-12), get first day of month
            startDate.setHours(0,0,0,0); //midnight to first day of the month
        } else {
            startDate = null;
        }

        //set filter
        const filter = startDate ? { createdAt : {$gte: startDate}} : {};

        //get orders based on filter
        const orders = await Order.find(filter);

        //calculating metrics
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum,item) => sum + item.price, 0);
        const pendingDeliveries = orders.filter(order => order.delivery_status === "pending").length;
        const averageOrderValue = totalOrders === 0 ? 0 : totalRevenue/totalOrders;
        const percentPending = totalOrders === 0 ? 0 : (pendingDeliveries/totalOrders)* 100;


        res.status(200).json({
            totalOrders,
            totalRevenue,
            averageOrderValue,
            percentPending : percentPending.toFixed(2),
            orders
        });

    } catch (error) {
        console.error("Failed to calculate order dashboard metrics", error);
        res.status(500).json({error : error.message});
    }
}

const getOverviewStats = async (req,res) => {
    try {
        const startDate = new Date();
        startDate.setHours(0,0,0,0);

        const orders = await Order.find({createdAt : {$gte : startDate}});

        const ordersToday = orders.length;
        const distinctClients = await Order.distinct("email", { createdAt: { $gte: startDate } });
        const clientsToday = distinctClients.length;
        const revenueToday = orders.reduce((sum,val) => sum + val.price, 0);

        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        yesterday.setHours(0,0,0,0);

        const prevorders = await Order.find({createdAt : {$gte : yesterday}});
        
        const ordersYesterday = prevorders.length;
        const distinctClientsYesterday = await Order.distinct("email", {createdAt : {$gte : yesterday}});
        const clientsYesterday = distinctClientsYesterday.length;
        const revenueYesterday = prevorders.reduce((sum, val) => sum + val.price, 0); 

        const revenuePercent = revenueToday === 0 ? 0 : ((revenueToday - revenueYesterday) / revenueToday) * 100;
        const orderPercent = ordersToday === 0 ? 0 : ((ordersToday - ordersYesterday) / ordersToday) * 100;
        const clientPercent = clientsToday === 0 ? 0 : ((clientsToday - clientsYesterday) / clientsToday) * 100;


        res.status(200).json({ordersToday, clientsToday, revenueToday, orderPercent, revenuePercent, clientPercent,
            ordersYesterday, clientsYesterday, revenueYesterday
        });
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

export {downloadInvoice, getOrders, getOrderStats, getBarChartStats, getPieChartStats, getDataAnalytics, getOverviewStats, getOrdersUserDashboard, updateOrderStatus};