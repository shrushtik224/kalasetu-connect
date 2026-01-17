import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, Package, IndianRupee, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/ui/Logo";

const ArtisanMySales = () => {
  const navigate = useNavigate();

  // Mock data - will be replaced with real data from database
  const uploadedVideos = [
    { id: 1, title: "मधुबनी फूलदान", date: "15 जनवरी 2026", status: "सक्रिय", views: 234 },
    { id: 2, title: "हाथ से बुनी टोकरी", date: "10 जनवरी 2026", status: "सक्रिय", views: 156 },
    { id: 3, title: "टेराकोटा मूर्ति", date: "5 जनवरी 2026", status: "बिक गया", views: 89 },
    { id: 4, title: "कांस्य दीपक", date: "1 जनवरी 2026", status: "बिक गया", views: 312 },
  ];

  const soldItems = [
    { id: 1, title: "टेराकोटा मूर्ति", buyer: "प्रिया शर्मा", price: 1500, date: "12 जनवरी 2026" },
    { id: 2, title: "कांस्य दीपक", buyer: "राहुल वर्मा", price: 2200, date: "8 जनवरी 2026" },
    { id: 3, title: "मधुबनी पेंटिंग", buyer: "अंजलि गुप्ता", price: 3500, date: "3 जनवरी 2026" },
    { id: 4, title: "हाथ से बुना दुपट्टा", buyer: "सुनीता देवी", price: 1800, date: "28 दिसंबर 2025" },
    { id: 5, title: "लकड़ी की मूर्ति", buyer: "विकास सिंह", price: 2500, date: "20 दिसंबर 2025" },
  ];

  const earnings = {
    total: 45500,
    thisMonth: 12450,
    lastMonth: 18200,
    pending: 4800,
  };

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/artisan/dashboard")}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-serif font-semibold">मेरी बिक्री</h1>
          <p className="text-xs text-muted-foreground">My Sales</p>
        </div>
        <Logo size="sm" showText={false} />
      </header>

      {/* Stats Overview */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-3 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">कुल कमाई</span>
            </div>
            <p className="text-xl font-serif font-bold text-primary">₹{earnings.total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-3 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">इस महीने</span>
            </div>
            <p className="text-xl font-serif font-bold text-accent">₹{earnings.thisMonth.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 px-4 pb-4 overflow-hidden">
        <Tabs defaultValue="videos" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="videos" className="text-xs">
              <Video className="w-3 h-3 mr-1" />
              वीडियो
            </TabsTrigger>
            <TabsTrigger value="sold" className="text-xs">
              <Package className="w-3 h-3 mr-1" />
              बिक्री
            </TabsTrigger>
            <TabsTrigger value="earnings" className="text-xs">
              <IndianRupee className="w-3 h-3 mr-1" />
              कमाई
            </TabsTrigger>
          </TabsList>

          {/* Uploaded Videos Tab */}
          <TabsContent value="videos" className="flex-1 overflow-y-auto space-y-3 mt-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">अपलोड किए गए वीडियो</p>
              <p className="text-xs text-muted-foreground">{uploadedVideos.length} वीडियो</p>
            </div>
            {uploadedVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{video.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{video.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{video.views} देखे गए</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    video.status === "सक्रिय" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    {video.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          {/* Sold Items Tab */}
          <TabsContent value="sold" className="flex-1 overflow-y-auto space-y-3 mt-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">बिके हुए सामान</p>
              <p className="text-xs text-muted-foreground">{soldItems.length} सामान</p>
            </div>
            {soldItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      खरीदार: {item.buyer}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                  <p className="text-lg font-serif font-bold text-primary">₹{item.price.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="flex-1 overflow-y-auto space-y-4 mt-0">
            <div className="mb-2">
              <p className="text-sm font-medium">कमाई का विवरण</p>
              <p className="text-xs text-muted-foreground">Earnings Summary</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-5 shadow-soft"
            >
              <p className="text-sm text-muted-foreground">कुल कमाई / Total Earnings</p>
              <p className="text-3xl font-serif font-bold text-primary mt-1">
                ₹{earnings.total.toLocaleString()}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl p-4 shadow-soft"
              >
                <p className="text-xs text-muted-foreground">इस महीने</p>
                <p className="text-lg font-serif font-bold text-foreground mt-1">
                  ₹{earnings.thisMonth.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-xl p-4 shadow-soft"
              >
                <p className="text-xs text-muted-foreground">पिछले महीने</p>
                <p className="text-lg font-serif font-bold text-foreground mt-1">
                  ₹{earnings.lastMonth.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Last Month</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-accent/10 rounded-xl p-4 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">लंबित भुगतान</p>
                  <p className="text-xs text-muted-foreground">Pending Payment</p>
                </div>
                <p className="text-xl font-serif font-bold text-accent">
                  ₹{earnings.pending.toLocaleString()}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-xl p-4 shadow-soft"
            >
              <p className="text-sm font-medium mb-3">महीनेवार कमाई</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">जनवरी 2026</span>
                  <span className="font-medium">₹12,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">दिसंबर 2025</span>
                  <span className="font-medium">₹18,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">नवंबर 2025</span>
                  <span className="font-medium">₹14,850</span>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtisanMySales;
