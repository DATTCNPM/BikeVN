import { Mail, MapPin, Phone } from "lucide-react";
const support = [
  "Trung tâm trợ giúp",
  "Hướng dẫn đặt xe",
  "Chính sách hoàn tiền",
];
const navigation = [
  {
    name: "Trang chủ",
    href: "/",
  },
  {
    name: "Dịch vụ",
    href: "#features",
  },
  {
    name: "Hướng dẫn",
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
    type: "Địa chỉ",
    value: "123 Đường ABC, Quận 1, TP.HCM",
    icon: <MapPin className="size-4" />,
  },
];

export { support, navigation, social, contact };
