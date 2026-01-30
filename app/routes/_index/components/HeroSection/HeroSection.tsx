import { Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { type Variants } from 'motion/react';
import { motion } from "motion/react";

const topAnimationGroup: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};

const title: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const subtitle: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const buttons: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
      </div>

      <div className="container mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <motion.div
          variants={topAnimationGroup}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-200 px-4 py-2 shadow-xs mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
            </span>
            <span className="text-sm font-semibold text-brand-800">
              2025 學測最新版
            </span>
          </div>

          {/* Heading */}
          <motion.h1
            variants={title}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-[1.1]"
          >
            一堂課，
            <span className="relative">
              <span className="relative z-10 text-brand-600">迎戰學測數學</span>
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={subtitle}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 lg:text-xl"
          >
            多年暢銷參考書作者親自編授，
            <br className="hidden sm:inline" />
            濃縮 30 年教學精華，用最少的時間，換取最高的分數。
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={buttons}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link to="/purchase" className="w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 rounded-lg">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8! text-base font-semibold rounded-lg shadow-sm group">
                立即加入課程
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="#features" className="w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 rounded-lg">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8! text-base font-semibold rounded-lg bg-white hover:bg-gray-50 ">
                了解課程詳情
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof / Stats */}
          {/* <div className="mt-16 lg:mt-20 w-full delay-500">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {[
                { label: "教學經驗", value: "30+", unit: "年", icon: BookOpen },
                { label: "精講影片", value: "200+", unit: "部", icon: Play },
                { label: "模考題庫", value: "持續", unit: "更新", icon: FileText },
                { label: "學生好評", value: "5.0", unit: "★", icon: Star },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 hover:border-brand-100 hover:bg-white transition-all duration-200 hover:shadow-lg hover:shadow-brand-100/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <dt className="text-sm font-medium text-gray-500">{stat.label}</dt>
                  </div>
                  <dd className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {stat.value}
                    <span className="text-lg text-brand-600 ml-1">{stat.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div> */}

        </motion.div>
      </div>
    </section >
  );
}

export { HeroSection };