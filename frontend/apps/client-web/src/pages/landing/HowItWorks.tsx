import Card from "./Card";
export default function HowItWorks() {
  const howItWorks = [
    {
      step: "01",
      title: "Tìm kiếm xe",
      desc: "Lọc và tìm dòng xe phù hợp với nhu cầu của bạn.",
    },
    {
      step: "02",
      title: "Đặt xe",
      desc: "Chọn thời gian thuê, xác nhận thông tin và thanh toán.",
    },
    {
      step: "03",
      title: "Nhận xe",
      desc: "Nhận xe nhanh chóng và bắt đầu hành trình của bạn.",
    },
  ];
  return (
    <section id="how-it-works">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-white/50 uppercase tracking-[0.3em] mb-4 text-sm">
          How It Works
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Thuê xe chỉ với vài bước đơn giản
        </h2>

        <p className="mt-6 text-white/60 text-lg">
          Quy trình nhanh chóng, tối ưu trải nghiệm giúp bạn tiết kiệm thời
          gian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {howItWorks.map((item, index) => (
          <Card
            index={index}
            step={item.step}
            title={item.title}
            desc={item.desc}
          />
        ))}
      </div>
    </section>
  );
}
