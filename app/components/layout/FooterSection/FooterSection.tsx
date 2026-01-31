import logoSrc from "~/assets/logo.png";
import { Link } from "react-router";
import { Mail } from "lucide-react";
import Icon from "~/components/ui/icon";
import { Mail02Icon } from "@hugeicons/core-free-icons";

function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-25 text-gray-900">
      {/* Main footer content */}
      <div className="container mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2rounded-xl">
                <img src={logoSrc} alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-xl font-semibold">寶哥高中數學</span>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-md mb-6">
              濃縮 30 年教學經驗，用最有效的方式幫助學生準備學測數學。
              我們相信好的教材應該讓每個人都能負擔得起。
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Icon icon={Mail02Icon} className="w-4 h-4" />
              <span>paopaomath@gmail.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">
              快速連結
            </h4>
            <ul className="space-y-3">
              {[
                { label: "免費試讀", href: "/preview" },
                // { label: "課程大綱", href: "/learn" },
                // { label: "購買課程", href: "/purchase" },
                { label: "登入", href: "/auth/login" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">
              課程資訊
            </h4>
            {/* <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-600 font-semibold">200+</span>
                <span>精講影片</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600 font-semibold">30+</span>
                <span>年教學經驗</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-600 font-semibold">7</span>
                <span>天退款保證</span>
              </li>
            </ul> */}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} 寶哥高中數學. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">
                隱私政策
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">
                服務條款
              </Link>
              <Link to="/refund" className="text-gray-500 hover:text-gray-700 transition-colors">
                退款政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { FooterSection };
