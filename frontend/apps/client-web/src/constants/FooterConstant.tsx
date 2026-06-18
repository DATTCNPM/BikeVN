import { Mail, MapPin, Phone } from "lucide-react";
const support = ["Help Center", "Booking Guide", "Refund Policy"];
const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Services",
    href: "#features",
  },
  {
    name: "Guides",
    href: "#how-it-works",
  },
];
const social = ["FB", "IG", "YT", "TW"];
const contact = [
  {
    type: "Email",
    value: "contact@bikevn.com",
    icon: <Mail className="size-4" />,
  },
  {
    type: "Hotline",
    value: "+84 123 456 789",
    icon: <Phone className="size-4" />,
  },
  {
    type: "Address",
    value: "123 Đường ABC, Quận 1, TP.HCM",
    icon: <MapPin className="size-4" />,
  },
];

export { support, navigation, social, contact };
