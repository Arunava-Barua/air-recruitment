"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Search,
  Settings,
  LogOut,
  Home,
  Wallet,
  User,
  Building2,
} from "lucide-react";

import NavBarLogin from "./NavBarLogin";
import {
  AirService,
  BUILD_ENV,
  type AirEventListener,
  type BUILD_ENV_TYPE,
} from "@mocanetwork/airkit";

// Get partner IDs from environment variables
const ISSUER_PARTNER_ID = "efaadeae-e2bb-4327-8ffe-e43933c3922a";
const enableLogging = true;

const ENV_OPTIONS = [
  { label: "Staging", value: BUILD_ENV.STAGING },
  { label: "Sandbox", value: BUILD_ENV.SANDBOX },
];

export function RecruiterHeader() {
  const [airService, setAirService] = useState<AirService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [currentEnv, setCurrentEnv] = useState<BUILD_ENV_TYPE>(
    BUILD_ENV.SANDBOX
  );
  const [partnerId, setPartnerId] = useState<string>(ISSUER_PARTNER_ID);

  // Get environment config based on current environment

  const initializeAirService = async (
    env: BUILD_ENV_TYPE = currentEnv,
    partnerIdToUse: string = partnerId
  ) => {
    if (!partnerIdToUse || partnerIdToUse === "your-partner-id") {
      console.warn("No valid Partner ID configured for nav bar login");
      setIsInitialized(true); // Set to true to prevent infinite loading
      return;
    }

    try {
      const service = new AirService({ partnerId: partnerIdToUse });
      await service.init({
        buildEnv: env as (typeof BUILD_ENV)[keyof typeof BUILD_ENV],
        enableLogging,
        skipRehydration: false,
      });
      setAirService(service);
      setIsInitialized(true);
      setIsLoggedIn(service.isLoggedIn);

      if (service.isLoggedIn && service.loginResult) {
        const result = service.loginResult;
        console.log("Login result @ initializeAirService", result);
        console.log("result @ initializeAirService", result);
        if (result.abstractAccountAddress) {
          setUserAddress(result.abstractAccountAddress || null);
        } else {
          console.log("no abstractAccountAddress @ initializeAirService");
          const accounts = await airService?.provider.request({
            method: "eth_accounts",
            params: [],
          });

          console.log(
            "accounts @ initializeAirService",
            accounts,
            airService?.provider
          );
          setUserAddress(
            Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : null
          );
        }
      }

      const eventListener: AirEventListener = async (data) => {
        if (data.event === "logged_in") {
          setIsLoggedIn(true);
          if (data.result.abstractAccountAddress) {
            setUserAddress(data.result.abstractAccountAddress || null);
          } else {
            const accounts = await airService?.provider.request({
              method: "eth_accounts",
              params: [],
            });
            setUserAddress(
              Array.isArray(accounts) && accounts.length > 0
                ? accounts[0]
                : null
            );
          }
        } else if (data.event === "logged_out") {
          setIsLoggedIn(false);
          setUserAddress(null);
        }
      };
      service.on(eventListener);
    } catch (err) {
      console.error("Failed to initialize AIRKit service in nav bar:", err);
      setIsInitialized(true); // Set to true to prevent infinite loading on error
    }
  };

  // Re-initialize AIRKit when partner ID or environment changes
  useEffect(() => {
    initializeAirService(currentEnv, partnerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEnv, partnerId]);

  useEffect(() => {
    // Only run on mount for initial load
    // (the above effect will handle env and partner ID changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initializeAirService(currentEnv, partnerId);
    return () => {
      if (airService) {
        airService.cleanUp();
      }
    };
  }, []);

  const handleLogin = async () => {
    if (!airService) return;
    setIsLoading(true);
    try {
      const loginResult = await airService.login();

      if (loginResult.abstractAccountAddress) {
        setUserAddress(loginResult.abstractAccountAddress || null);
      } else {
        const accounts = await airService?.provider.request({
          method: "eth_accounts",
          params: [],
        });
        setUserAddress(
          Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : null
        );
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
      console.log("Login completed, userAddress:", userAddress);
    }
  };

  const handleLogout = async () => {
    if (!airService) return;
    try {
      await airService.logout();
      setUserAddress(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Credify</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500">Recruiter Explorer</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>

            <NavBarLogin
              isLoading={isLoading}
              isInitialized={isInitialized}
              isLoggedIn={isLoggedIn}
              userAddress={userAddress}
              onLogin={handleLogin}
              onLogout={handleLogout}
              currentEnv={currentEnv}
              setCurrentEnv={(env) => setCurrentEnv(env as BUILD_ENV_TYPE)}
              envOptions={ENV_OPTIONS}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
