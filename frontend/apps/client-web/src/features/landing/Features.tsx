import Card from "./Card";
import {
  Zap,
  Motorbike,
  MessageCircleQuestionMark,
  BanknoteArrowDown,
} from "lucide-react";
export default function Feature() {
  const features = [
    {
      title: "Đặt xe nhanh chóng",
      desc: "Tìm kiếm và đặt xe chỉ trong vài phút với giao diện tối ưu và trực quan.",
      icon: <Zap className="w-10 h-10 text-white" />,
    },
    {
      title: "Giá cả minh bạch",
      desc: "Hiển thị đầy đủ chi phí, không phát sinh phụ phí bất ngờ.",
      icon: <BanknoteArrowDown className="w-10 h-10 text-white" />,
    },
    {
      title: "Nhiều dòng xe cao cấp",
      desc: "Đa dạng lựa chọn từ xe phổ thông đến xe sang phù hợp mọi nhu cầu.",
      icon: <Motorbike className="w-10 h-10 text-white" />,
    },
    {
      title: "Hỗ trợ 24/7",
      desc: "Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn trong suốt quá trình thuê xe.",
      icon: <MessageCircleQuestionMark className="w-10 h-10 text-white" />,
    },
  ];
  return (
    <section id="features" className="space-y-16">
      <div className="max-w-3xl mx-auto text-center text-muted-foreground">
        <p className="uppercase tracking-[0.3em] mb-4 text-sm">Why Choose Us</p>

        <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
          Trải nghiệm thuê xe hiện đại,
          <br />
          nhanh chóng và đáng tin cậy
        </h2>

        <p className="mt-6 text-lg">
          Chúng tôi mang đến nền tảng thuê xe tiện lợi, minh bạch và tối ưu trải
          nghiệm người dùng từ tìm kiếm đến đặt xe.
        </p>
      </div>

      {/* Feature Cards */}
      <div
        id="features"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {features.map((item, index) => (
          <Card
            index={index}
            title={item.title}
            desc={item.desc}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}
