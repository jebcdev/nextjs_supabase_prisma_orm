"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
    { href: "/", label: "Todos" },
    { href: "/create", label: "Crear" },
];

export const NavBar = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-mono font-medium shrink-0"
                >
                    <CheckSquare className="h-5 w-5 text-primary" />
                    <span className="text-sm tracking-tight">
                        dev<span className="text-primary">todos</span>
                    </span>
                </Link>

                {/* Desktop nav - Se oculta en móvil (hidden), se muestra en md (flex) */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-sm transition-colors",
                                pathname === href
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile toggle - Se muestra en móvil (flex), se oculta en md (hidden) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {open ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile menu - Solo se renderiza si está abierto Y está en pantalla pequeña */}
            {open && (
                <div className="md:hidden border-t border-border/40 bg-background px-4 pb-4 absolute w-full left-0 shadow-lg">
                    <nav className="flex flex-col gap-1 pt-3">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "rounded-md px-3 py-2 text-sm transition-colors",
                                    pathname === href
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};
