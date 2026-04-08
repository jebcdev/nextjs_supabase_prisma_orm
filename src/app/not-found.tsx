"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    const router = useRouter();

    const handleNavigation = () => {
        // Verificamos si hay historial previo del mismo origen directamente al hacer click
        const hasReferrer = typeof document !== "undefined" && document.referrer;
        const isSameOrigin = hasReferrer && document.referrer.startsWith(window.location.origin);

        if (isSameOrigin) {
            router.back();
        } else {
            router.push(process.env.NEXT_PUBLIC_APP_URL || "/");
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-hidden">
            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.04] bg-grid-white" />

            {/* Glow orbs */}
            <div className="absolute w-96 h-96 rounded-full bg-emerald-500/8 blur-3xl pointer-events-none animate-orb-1" />
            <div className="absolute w-64 h-64 rounded-full bg-red-500/5 blur-3xl pointer-events-none animate-orb-2" />

            {/* Corner TL */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs text-zinc-600 font-mono tracking-widest uppercase">
                    ERROR / 404
                </span>
            </div>

            {/* Corner TR */}
            <div className="absolute top-6 right-6 text-xs text-zinc-700 font-mono tracking-widest">
                JEBC-DeV v1.0.0
            </div>

            {/* Corner BR */}
            <div className="absolute bottom-6 right-6 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-zinc-700 font-mono">
                    LOST
                </span>
            </div>

            {/* Main content */}
            <div className="relative z-20 flex flex-col items-center text-center px-6">
                {/* 404 */}
                <Link
                    href={"/"}
                    className="text-[9rem] font-black leading-none text-white select-none mb-6"
                    style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        letterSpacing: "-4px",
                    }}
                >
                    404
                </Link>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-sm border border-zinc-800 bg-zinc-900/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">
                        Página no encontrada
                    </span>
                </div>

                {/* Message */}
                <p className="text-zinc-500 text-sm font-mono max-w-sm leading-relaxed mb-10">
                    La ruta que buscas no existe o fue movida.
                    <br />
                    Regresa para continuar.
                </p>

                {/* CTA */}
                <Button
                    onClick={handleNavigation}
                    className="h-11 px-8 bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-sm tracking-widest uppercase rounded-sm transition-all hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] active:scale-[0.99] cursor-pointer"
                >
                    ← Volver
                </Button>

                {/* Decorative code */}
                <div className="mt-12 font-mono text-xs text-zinc-800 text-left max-w-xs">
                    <span className="text-zinc-700">{">"}</span>{" "}
                    <span className="text-red-900">ERROR</span>{" "}
                    <span className="text-zinc-800">
                        route not found
                    </span>
                    <br />
                    <span className="text-zinc-700">{">"}</span>{" "}
                    <span className="text-zinc-800">status: 404</span>
                    <br />
                    <span className="text-zinc-700">{">"}</span>{" "}
                    <span className="text-emerald-900">
                        suggestion: go home
                    </span>
                </div>
            </div>
        </div>
    );
}