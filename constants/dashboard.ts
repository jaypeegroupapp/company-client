import { FileText, Home, PackageCheck, Truck, User } from "lucide-react";

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Orders", href: "/orders", icon: PackageCheck },
  { name: "Orders By Trucks", href: "/truck-orders", icon: Truck },
];

export const otherNavItems = [
  { name: "Company Invoices", href: "/company-invoices", icon: FileText },
  { name: "Manage Trucks", href: "/trucks", icon: Truck },
  { name: "Profile", href: "/profile", icon: User },
];
