 import { motion } from "framer-motion";
 import { useNavigate } from "react-router-dom";
 import { ChevronLeft, Package, Clock, CheckCircle, Truck } from "lucide-react";
 import { Badge } from "@/components/ui/badge";
 import madhubaniVase from "@/assets/madhubani-vase.jpg";
 import artisanPortrait from "@/assets/artisan-portrait.jpg";
 
 interface Order {
   id: string;
   productName: string;
   productImage: string;
   artisanName: string;
   artisanImage: string;
   price: number;
   status: "processing" | "shipped" | "delivered";
   orderDate: string;
   deliveryDate?: string;
 }
 
 const mockOrders: Order[] = [
   {
     id: "ORD-2024-001",
     productName: "Hand-painted Madhubani Terra Vase",
     productImage: madhubaniVase,
     artisanName: "Ramesh Kumar",
     artisanImage: artisanPortrait,
     price: 1200,
     status: "delivered",
     orderDate: "2024-01-15",
     deliveryDate: "2024-01-25",
   },
   {
     id: "ORD-2024-002",
     productName: "Terracotta Wall Hanging",
     productImage: madhubaniVase,
     artisanName: "Sunita Devi",
     artisanImage: artisanPortrait,
     price: 850,
     status: "shipped",
     orderDate: "2024-02-01",
   },
   {
     id: "ORD-2024-003",
     productName: "Handwoven Bamboo Basket Set",
     productImage: madhubaniVase,
     artisanName: "Mohan Lal",
     artisanImage: artisanPortrait,
     price: 650,
     status: "processing",
     orderDate: "2024-02-03",
   },
 ];
 
 const statusConfig = {
   processing: {
     label: "Processing",
     icon: Clock,
     color: "bg-mustard/20 text-mustard border-mustard/30",
   },
   shipped: {
     label: "Shipped",
     icon: Truck,
     color: "bg-primary/20 text-primary border-primary/30",
   },
   delivered: {
     label: "Delivered",
     icon: CheckCircle,
     color: "bg-success/20 text-success border-success/30",
   },
 };
 
 const OrderHistory = () => {
   const navigate = useNavigate();
 
   const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleDateString("en-IN", {
       day: "numeric",
       month: "short",
       year: "numeric",
     });
   };
 
   return (
     <div className="min-h-screen bg-background paper-texture">
       {/* Header */}
       <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
         <div className="flex items-center justify-between p-4">
           <button
             onClick={() => navigate("/buyer")}
             className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
           >
             <ChevronLeft className="w-5 h-5" />
           </button>
           <h1 className="font-serif text-lg">Order History</h1>
           <div className="w-10" />
         </div>
       </header>
 
       {/* Main Content */}
       <main className="pt-20 pb-8 px-4">
         <div className="space-y-4">
           {mockOrders.map((order, index) => {
             const StatusIcon = statusConfig[order.status].icon;
             
             return (
               <motion.div
                 key={order.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="bg-card rounded-xl p-4 shadow-soft"
               >
                 {/* Order Header */}
                 <div className="flex items-center justify-between mb-3">
                   <span className="text-xs text-muted-foreground font-mono">
                     {order.id}
                   </span>
                   <Badge className={statusConfig[order.status].color}>
                     <StatusIcon className="w-3 h-3 mr-1" />
                     {statusConfig[order.status].label}
                   </Badge>
                 </div>
 
                 {/* Product Info */}
                 <div className="flex gap-4">
                   <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                     <img
                       src={order.productImage}
                       alt={order.productName}
                       className="w-full h-full object-cover"
                     />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                       {order.productName}
                     </h3>
                     <div className="flex items-center gap-2 mb-2">
                       <div className="w-5 h-5 rounded-full overflow-hidden">
                         <img
                           src={order.artisanImage}
                           alt={order.artisanName}
                           className="w-full h-full object-cover"
                         />
                       </div>
                       <span className="text-sm text-muted-foreground">
                         by {order.artisanName}
                       </span>
                     </div>
                     <p className="text-lg font-serif font-bold text-primary">
                       ₹{order.price.toLocaleString("en-IN")}
                     </p>
                   </div>
                 </div>
 
                 {/* Order Dates */}
                 <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
                   <div>
                     <span className="text-muted-foreground">Ordered: </span>
                     <span className="text-foreground">{formatDate(order.orderDate)}</span>
                   </div>
                   {order.deliveryDate && (
                     <div>
                       <span className="text-muted-foreground">Delivered: </span>
                       <span className="text-foreground">{formatDate(order.deliveryDate)}</span>
                     </div>
                   )}
                 </div>
               </motion.div>
             );
           })}
         </div>
 
         {/* Empty State - shown when no orders */}
         {mockOrders.length === 0 && (
           <div className="flex flex-col items-center justify-center py-16 text-center">
             <Package className="w-16 h-16 text-muted-foreground mb-4" />
             <h3 className="font-serif text-xl text-foreground mb-2">No orders yet</h3>
             <p className="text-muted-foreground mb-6">
               Start exploring handcrafted treasures from artisans
             </p>
             <button
               onClick={() => navigate("/buyer")}
               className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
             >
               Explore Products
             </button>
           </div>
         )}
       </main>
     </div>
   );
 };
 
 export default OrderHistory;