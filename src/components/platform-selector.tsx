"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { Platform } from "@/types/platform";
import { switchPlatform } from "@/services/external-api/platform";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  platforms: Platform[];
  currentPlatform: Platform | null;
  showSelector: boolean;
}

export function PlatformSelector({
  platforms,
  currentPlatform,
  showSelector,
}: PlatformSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Remove duplicates by id to ensure unique platforms
  const uniquePlatforms = useMemo(() => {
    const seen = new Set<number>();
    return platforms.filter((platform) => {
      if (seen.has(platform.id)) {
        return false;
      }
      seen.add(platform.id);
      return true;
    });
  }, [platforms]);

  if (!showSelector || uniquePlatforms.length <= 1) {
    return null;
  }

  const handlePlatformChange = async (platformId: number) => {
    if (isLoading || !platformId) return;
    if (currentPlatform && platformId === currentPlatform.id) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(false);

    try {
      const response = await switchPlatform(platformId);

      // Atualiza o token no localStorage
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("platform_id", String(response.platform_id));
      }

      toast.success(response.message || "Plataforma alterada com sucesso");

      // Recarrega a página para aplicar as mudanças
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: unknown) {
      console.error("Erro ao trocar plataforma:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao trocar plataforma. Tente novamente.";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="gap-2 min-w-[150px] justify-between"
        >
          <span className="truncate">
            {currentPlatform?.name || "Plataforma"}
          </span>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {uniquePlatforms.map((platform) => (
          <DropdownMenuItem
            key={platform.id}
            onClick={() => handlePlatformChange(platform.id)}
            disabled={isLoading}
            className={cn(
              "cursor-pointer",
              currentPlatform?.id === platform.id && "bg-accent"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="truncate">{platform.name}</span>
              {currentPlatform?.id === platform.id && (
                <Check className="h-4 w-4 shrink-0 ml-2" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

