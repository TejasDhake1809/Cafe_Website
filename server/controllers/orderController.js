import Order from '../model/orderModel.js';
import Product from '../model/productModel.js';
// import Apriori from 'node-apriori';
import { generateInvoice } from "../invoice/invoicegenerator.js";
import path from "path";
import fs from "fs";
import { redis } from '../lib/redis.js';
// orderController.js

// -------------------- Helper: compute startDate from timeframe --------------------
const getStartDate = (timeframe) => {
  const now = new Date();
  let startDate;
  if (timeframe === "Today") {
    startDate = new Date();
    startDate.setHours(0,0,0,0);
  } else if (timeframe === "Weekly") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startDate = new Date(now);
    startDate.setDate(diff);
    startDate.setHours(0,0,0,0);
  } else if (timeframe === "Monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate.setHours(0,0,0,0);
  } else {
    startDate = null;
  }
  return startDate;
};


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

// const getPieChartStats = async (req, res) => {
//     const startTime = Date.now(); // start timer
//   try {
//     const products = await Product.find();
//     // create a map for faster lookup: productId => product
//     const productMap = {};
//     products.forEach(p => productMap[p._id.toString()] = p);

//     const now = new Date();
//     const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
//     startDate.setHours(0, 0, 0, 0);

//     const orders = await Order.find({ createdAt: { $gte: startDate } });

//     // Initialize category totals
//     let starters = 0, maincourse = 0, dessert = 0, drinks = 0;

//     orders.forEach(order => {
//       if (order.items && Array.isArray(order.items)) {
//         order.items.forEach(item => {
//           const prod = productMap[item.productId.toString()];
//           if (!prod) return; // skip if product not found

//           const category = prod.category;
//           const amount = prod.price * item.count;

//           if (category === "Starters") starters += amount;
//           else if (category === "Main Course") maincourse += amount;
//           else if (category === "Dessert") dessert += amount;
//           else if (category === "Drinks") drinks += amount;
//         });
//       }
//     });

//     const total = starters + maincourse + dessert + drinks;

//     // avoid division by zero
//     const starterspercent = total ? ((starters / total) * 100).toFixed(2) : "0.00";
//     const maincoursepercent = total ? ((maincourse / total) * 100).toFixed(2) : "0.00";
//     const dessertpercent = total ? ((dessert / total) * 100).toFixed(2) : "0.00";
//     const drinkspercent = total ? ((drinks / total) * 100).toFixed(2) : "0.00";

//     res.status(200).json({ starterspercent, maincoursepercent, dessertpercent, drinkspercent });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   } finally {
//     const endTime = Date.now();
//     console.log(`[PieAnalytics] Execution time for timeframe "${req.query.timeframe}": ${endTime - startTime} ms`);
//   }
// };


// const getDataAnalytics = async (req, res) => {
//     const startTime = Date.now(); // start timer
//   try {
//     const { timeframe } = req.query;
//     const now = new Date();
//     let startDate;

//     // -------------------- Date logic --------------------
//     if (timeframe === "Today") {
//       startDate = new Date();
//       startDate.setHours(0, 0, 0, 0);
//     } else if (timeframe === "Weekly") {
//       const day = now.getDay(); // 0=Sunday
//       const diff = now.getDate() - day + (day === 0 ? -6 : 1); // back to Monday
//       startDate = new Date(now);
//       startDate.setDate(diff);
//       startDate.setHours(0, 0, 0, 0);
//     } else if (timeframe === "Monthly") {
//       startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//       startDate.setHours(0, 0, 0, 0);
//     } else {
//       startDate = null;
//     }

//     const filter = startDate ? { createdAt: { $gte: startDate } } : {};
//     const orders = await Order.find(filter).sort({ createdAt: -1 });

//     if (!orders.length) {
//       // no orders in timeframe
//       return res.status(200).json({
//         repeatPercent: "0.00",
//         newCustomers: 0,
//         averageItemsOrdered: "0.00",
//         online: "0.00",
//         cash: "0.00",
//       });
//     }

//     // -------------------- Precompute first-ever orders --------------------
//     const emails = [...new Set(orders.map(order => order.email))];
//     const firstOrders = await Order.aggregate([
//       { $match: { email: { $in: emails } } },
//       { $group: { _id: "$email", firstOrder: { $min: "$createdAt" } } }
//     ]);

//     const firstOrderMap = {};
//     firstOrders.forEach(f => firstOrderMap[f._id] = f.firstOrder.getTime());

//     // -------------------- Analytics --------------------
//     let totalItemsOrdered = 0;
//     let online = 0;
//     let cash = 0;
//     const emailCounts = {};
//     let newCustomers = 0;

//     orders.forEach(order => {
//       // payment type
//       if (order.payment_type === "cash") cash += 1;
//       else online += 1;

//       // total items ordered
//       totalItemsOrdered += order.items.reduce((sum, item) => sum + item.count, 0);

//       // email counts
//       emailCounts[order.email] = (emailCounts[order.email] || 0) + 1;

//       // new customer check
//       if (firstOrderMap[order.email] === order.createdAt.getTime()) newCustomers += 1;
//     });

//     // -------------------- Percentages --------------------
//     const totalOrders = orders.length;
//     online = ((online / totalOrders) * 100).toFixed(2);
//     cash = ((cash / totalOrders) * 100).toFixed(2);
//     const averageItemsOrdered = (totalItemsOrdered / totalOrders).toFixed(2);

//     // repeat customers
//     const totalCustomers = Object.keys(emailCounts).length;
//     const repeatCustomers = Object.values(emailCounts).filter(c => c > 1).length;
//     const repeatPercent = ((repeatCustomers / totalCustomers) * 100).toFixed(2);

//     return res.status(200).json({
//       repeatPercent,
//       newCustomers,
//       averageItemsOrdered,
//       online,
//       cash
//     });

//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   } finally {
//     const endTime = Date.now();
//     console.log(`[DataAnalytics] Execution time for timeframe "${req.query.timeframe}": ${endTime - startTime} ms`);
//   }
// };

// -------------------- Controller: Data Analytics --------------------
const getDataAnalytics = async (req, res) => {
    const startTime = Date.now(); // start timer
  try {
    const { timeframe } = req.query;
    const cacheKey = `analytics:${timeframe}`;

    // 1️⃣ Check Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    // 2️⃣ Fetch orders within timeframe
    const startDate = getStartDate(timeframe);
    const filter = startDate ? { createdAt: { $gte: startDate } } : {};
    const orders = await Order.find(filter).sort({ createdAt: 1 });

    if (!orders.length) {
      const empty = {
        repeatPercent: "0.00",
        newCustomers: 0,
        averageItemsOrdered: "0.00",
        online: "0.00",
        cash: "0.00",
      };
      await redis.set(cacheKey, JSON.stringify(empty), "EX", 300);
      return res.status(200).json(empty);
    }

    // 3️⃣ Precompute first-ever orders for new customer calculation
    const emails = [...new Set(orders.map(o => o.email))];
    const firstOrders = await Order.aggregate([
      { $match: { email: { $in: emails } } },
      { $group: { _id: "$email", firstOrder: { $min: "$createdAt" } } }
    ]);
    const firstOrderMap = {};
    firstOrders.forEach(f => firstOrderMap[f._id] = f.firstOrder.getTime());

    // 4️⃣ Compute analytics
    let totalItems = 0, online = 0, cash = 0;
    const emailCounts = {};
    let newCustomers = 0;

    orders.forEach(order => {
      if (order.payment_type === "cash") cash += 1;
      else online += 1;

      totalItems += order.items.reduce((sum, item) => sum + item.count, 0);
      emailCounts[order.email] = (emailCounts[order.email] || 0) + 1;

      if (firstOrderMap[order.email] === order.createdAt.getTime()) newCustomers += 1;
    });

    const totalOrders = orders.length;
    online = ((online / totalOrders) * 100).toFixed(2);
    cash = ((cash / totalOrders) * 100).toFixed(2);
    const averageItemsOrdered = (totalItems / totalOrders).toFixed(2);
    const totalCustomers = Object.keys(emailCounts).length;
    const repeatCustomers = Object.values(emailCounts).filter(c => c > 1).length;
    const repeatPercent = ((repeatCustomers / totalCustomers) * 100).toFixed(2);

    const response = { repeatPercent, newCustomers, averageItemsOrdered, online, cash };

    // 5️⃣ Cache response in Redis
    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    const endTime = Date.now();
    console.log(`[DataAnalytics] Execution time for timeframe "${req.query.timeframe}": ${endTime - startTime} ms`);
  }
};

// -------------------- Controller: Pie Chart Stats --------------------
const getPieChartStats = async (req, res) => {
    const startTime = Date.now(); // start timer
  try {
    const { timeframe } = req.query;
    const cacheKey = `pieChart:${timeframe}`;

    // 1️⃣ Check Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const startDate = getStartDate(timeframe);
    const orders = await Order.find(startDate ? { createdAt: { $gte: startDate } } : {});

    if (!orders.length) {
      const empty = { starterspercent: "0.00", maincoursepercent: "0.00", dessertpercent: "0.00", drinkspercent: "0.00" };
      await redis.set(cacheKey, JSON.stringify(empty), "EX", 300);
      return res.status(200).json(empty);
    }

    const products = await Product.find();
    const productMap = {};
    products.forEach(p => productMap[p._id.toString()] = p);

    let starters=0, maincourse=0, dessert=0, drinks=0;
    orders.forEach(order => {
      if(order.items) order.items.forEach(item => {
        const prod = productMap[item.productId.toString()];
        if(!prod) return;
        const amount = prod.price * item.count;
        if(prod.category==="Starters") starters+=amount;
        else if(prod.category==="Main Course") maincourse+=amount;
        else if(prod.category==="Dessert") dessert+=amount;
        else if(prod.category==="Drinks") drinks+=amount;
      });
    });

    const total = starters + maincourse + dessert + drinks;
    const response = {
      starterspercent: total ? ((starters/total)*100).toFixed(2) : "0.00",
      maincoursepercent: total ? ((maincourse/total)*100).toFixed(2) : "0.00",
      dessertpercent: total ? ((dessert/total)*100).toFixed(2) : "0.00",
      drinkspercent: total ? ((drinks/total)*100).toFixed(2) : "0.00",
    };

    // 2️⃣ Cache response in Redis
    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  } finally {
    const endTime = Date.now();
    console.log(`[PieAnalytics] Execution time for timeframe "${req.query.timeframe}": ${endTime - startTime} ms`);
  }
};
 
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
        const orders = await Order.find(filter).sort({createdAt : -1});
        const filteredOrders = orders.filter(order => order.delivery_status !== "cancelled")
        
        //calculating metrics
        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum,item) => sum + item.price, 0);
        const pendingDeliveries = filteredOrders.filter(order => order.delivery_status === "pending").length;
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