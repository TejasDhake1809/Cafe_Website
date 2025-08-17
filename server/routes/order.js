import express from 'express';
import { downloadInvoice, getOrders, getOrderStats, getBarChartStats, getPieChartStats, getDataAnalytics, getOverviewStats, getOrdersUserDashboard, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

//get limited number of orders in whole
router.get('/get-order', getOrders);

//get the stats for order stats dashboard page
router.get('/stats', getOrderStats);

//get the stats for the bar chart analytics page
router.get('/chart/bar', getBarChartStats);

//get the stats for the pie chart page
router.get('/chart/pie', getPieChartStats);

//get data analytics for dashboard
router.get('/data', getDataAnalytics);

//get data for overview page
router.get('/overview', getOverviewStats);

//get orders for user dashboard page
router.get('/get-all-orders', getOrdersUserDashboard);

//update order status
router.patch('/update-status/:id', updateOrderStatus);

//generate order invoice 
router.get("/:id/invoice", downloadInvoice);

export default router;