import { AccountDetailsHeroSection } from "@/components/sections/AccountDetailsHeroSection";
import { AccountDetailsSection } from "@/components/sections/AccountDetailsSection";

export default function AccountDetailsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AccountDetailsHeroSection />
      <AccountDetailsSection />
    </div>
  );
}