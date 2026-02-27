import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    IndianRupee,
    Clock,
    Package,
    Loader2,
    TrendingUp,
    ArrowLeft,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface PriceEstimate {
    suggestedMin: number;
    suggestedMax: number;
    reasoning: string;
}

const PriceEstimator = () => {
    const navigate = useNavigate();
    const [productName, setProductName] = useState("");
    const [materialCost, setMaterialCost] = useState("");
    const [hoursSpent, setHoursSpent] = useState("");
    const [loading, setLoading] = useState(false);
    const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLanguage();

    const handleEstimate = async () => {
        if (!productName.trim() || !materialCost || !hoursSpent) {
            setError(t.fillAllFields);
            return;
        }

        setLoading(true);
        setError(null);
        setEstimate(null);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("Gemini API key not configured.");
            }

            const systemPrompt = `You are an expert pricing analyst for Indian handicrafts. An artisan has created: ${productName.trim()}. The raw materials cost ₹${materialCost} and it took ${hoursSpent} hours to make. Calculate a fair market retail price for an urban e-commerce buyer. Return ONLY a raw JSON object with NO markdown formatting, using exactly these three keys: "suggestedMin" (number), "suggestedMax" (number), "reasoning" (string, max 2 sentences).`;

            // Retry logic for rate limits (429 errors)
            const MAX_RETRIES = 2;
            let lastError: Error | null = null;

            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                try {
                    if (attempt > 0) {
                        // Wait before retry (increasing backoff)
                        const waitMs = 1500 * attempt;
                        setLoading(true);
                        await new Promise((r) => setTimeout(r, waitMs));
                    }

                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                contents: [
                                    {
                                        parts: [{ text: systemPrompt }],
                                    },
                                ],
                                generationConfig: {
                                    temperature: 0.4,
                                    maxOutputTokens: 2048,
                                },
                            }),
                        }
                    );

                    if (response.status === 429) {
                        const errorData = await response.json();
                        lastError = new Error(
                            errorData.error?.message || "Rate limit exceeded"
                        );
                        console.warn(
                            `Rate limited (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying...`
                        );
                        continue; // retry
                    }

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.error?.message || `API Error: ${response.status}`
                        );
                    }

                    const result = await response.json();

                    // Gemini 2.5 Flash may return multiple parts (thinking + text)
                    // Find the text part that contains our JSON
                    const parts = result.candidates?.[0]?.content?.parts || [];
                    let rawText = "";
                    for (const part of parts) {
                        if (part.text) {
                            rawText = part.text;
                        }
                    }

                    console.log("Gemini raw response:", rawText);

                    if (!rawText) {
                        throw new Error("No response received from Gemini AI.");
                    }

                    // Clean potential markdown formatting (```json ... ```)
                    let cleanedText = rawText
                        .replace(/```json\s*/gi, "")
                        .replace(/```\s*/gi, "")
                        .trim();

                    // Try to extract JSON object from the text using regex
                    // This handles cases where there's extra text around the JSON
                    let parsed: PriceEstimate;
                    try {
                        parsed = JSON.parse(cleanedText);
                    } catch {
                        // Fallback: find the first {...} block in the text
                        const jsonMatch = cleanedText.match(/\{[\s\S]*?"suggestedMin"[\s\S]*?"suggestedMax"[\s\S]*?"reasoning"[\s\S]*?\}/);
                        if (!jsonMatch) {
                            throw new Error("Could not parse AI response. Please try again.");
                        }
                        parsed = JSON.parse(jsonMatch[0]);
                    }

                    if (
                        typeof parsed.suggestedMin !== "number" ||
                        typeof parsed.suggestedMax !== "number" ||
                        typeof parsed.reasoning !== "string"
                    ) {
                        throw new Error("Invalid response format from AI.");
                    }

                    setEstimate(parsed);
                    lastError = null;
                    break; // success, exit retry loop
                } catch (innerErr: any) {
                    lastError = innerErr;
                    if (attempt === MAX_RETRIES) break;
                }
            }

            if (lastError) {
                throw lastError;
            }
        } catch (err: any) {
            console.error("Price estimation error:", err);
            setError(
                err.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const isFormValid =
        productName.trim() && materialCost && hoursSpent;

    return (
        <div className="min-h-screen bg-background paper-texture">
            <div className="max-w-lg mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/artisan/dashboard")}
                        className="shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            {t.priceEstimatorTitle}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {t.priceEstimatorDesc}
                        </p>
                    </div>
                </div>

                {/* Input Card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-card rounded-2xl shadow-soft border border-border p-5 space-y-5"
                >
                    {/* Product Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            {t.productName}
                        </label>
                        <Input
                            placeholder={t.productNamePlaceholder}
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="h-11 rounded-xl bg-background border-border focus:border-primary text-sm"
                        />
                    </div>

                    {/* Material Cost */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-primary" />
                            {t.materialCost}
                        </label>
                        <Input
                            type="number"
                            placeholder={t.materialCostPlaceholder}
                            min={0}
                            value={materialCost}
                            onChange={(e) => setMaterialCost(e.target.value)}
                            className="h-11 rounded-xl bg-background border-border focus:border-primary text-sm"
                        />
                    </div>

                    {/* Hours Spent */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            {t.hoursSpent}
                        </label>
                        <Input
                            type="number"
                            placeholder={t.hoursSpentPlaceholder}
                            min={0}
                            step={0.5}
                            value={hoursSpent}
                            onChange={(e) => setHoursSpent(e.target.value)}
                            className="h-11 rounded-xl bg-background border-border focus:border-primary text-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleEstimate}
                        disabled={loading || !isFormValid}
                        className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {t.analyzingMarket}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                {t.getMarketEstimate}
                            </span>
                        )}
                    </Button>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-red-800">
                                    {t.estimationFailed}
                                </p>
                                <p className="text-xs text-red-600 mt-0.5">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Card */}
                <AnimatePresence>
                    {estimate && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.97 }}
                            transition={{ duration: 0.5, type: "spring", bounce: 0.25 }}
                            className="mt-5"
                        >
                            {/* Price Range Card */}
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 shadow-soft overflow-hidden relative">
                                {/* Decorative background circles */}
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl" />
                                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-100/40 rounded-full blur-2xl" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm font-semibold text-emerald-700 tracking-wide uppercase">
                                            {t.suggestedPrice}
                                        </span>
                                    </div>

                                    {/* Price Range */}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-serif font-extrabold text-emerald-700">
                                            ₹{estimate.suggestedMin.toLocaleString("en-IN")}
                                        </span>
                                        <span className="text-2xl font-serif font-bold text-emerald-500/70 mx-1">
                                            —
                                        </span>
                                        <span className="text-4xl font-serif font-extrabold text-emerald-700">
                                            ₹{estimate.suggestedMax.toLocaleString("en-IN")}
                                        </span>
                                    </div>

                                    {/* Visual bar */}
                                    <div className="mt-4 h-2.5 bg-emerald-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "75%" }}
                                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                                        />
                                    </div>

                                    {/* Labels under bar */}
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[10px] text-emerald-600/70">
                                            {t.material}: ₹{parseInt(materialCost).toLocaleString("en-IN")}
                                        </span>
                                        <span className="text-[10px] text-emerald-600/70">
                                            {t.suggestedPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Reasoning Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-3 bg-card border border-border rounded-xl p-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {t.aiReasoning}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {estimate.reasoning}
                                </p>
                            </motion.div>

                            {/* Profit Indicator */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
                            >
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <p className="text-[10px] text-amber-700/60 uppercase">{t.material}</p>
                                        <p className="text-sm font-bold text-amber-800">
                                            ₹{parseInt(materialCost).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-amber-700/60 uppercase">{t.labor} ({hoursSpent}h)</p>
                                        <p className="text-sm font-bold text-amber-800">
                                            ₹{(parseInt(hoursSpent) * 100).toLocaleString("en-IN")}
                                        </p>
                                        <p className="text-[8px] text-amber-600/50">@₹100/hr</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-emerald-700/60 uppercase">{t.avgProfit}</p>
                                        <p className="text-sm font-bold text-emerald-700">
                                            ₹{Math.round(
                                                ((estimate.suggestedMin + estimate.suggestedMax) / 2) -
                                                parseInt(materialCost) -
                                                parseInt(hoursSpent) * 100
                                            ).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PriceEstimator;
