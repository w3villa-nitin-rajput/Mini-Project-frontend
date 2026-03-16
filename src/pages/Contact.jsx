import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from "react-icons/fi";
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa";

const contactInfo = [
  {
    icon: <FiMail className="w-5 h-5" />,
    label: "Email Us",
    value: "support@zepto.in",
    sub: "We reply within 2 hours",
  },
  {
    icon: <FiPhone className="w-5 h-5" />,
    label: "Call Us",
    value: "+91 98765 43210",
    sub: "Mon – Sat, 9 AM – 8 PM",
  },
  {
    icon: <FiMapPin className="w-5 h-5" />,
    label: "Visit Us",
    value: "12, MG Road, Bangalore",
    sub: "Karnataka – 560001, India",
  },
  {
    icon: <FiClock className="w-5 h-5" />,
    label: "Working Hours",
    value: "24 × 7 Delivery",
    sub: "Support: Mon–Sat 9 AM–8 PM",
  },
];

const socialLinks = [
  { icon: <FaInstagram />, label: "Instagram", href: "#", color: "hover:bg-pink-500" },
  { icon: <FaTwitter />,   label: "Twitter",   href: "#", color: "hover:bg-sky-500"  },
  { icon: <FaFacebookF />, label: "Facebook",  href: "#", color: "hover:bg-blue-600" },
  { icon: <FaYoutube />,   label: "YouTube",   href: "#", color: "hover:bg-red-500"  },
];

const INITIAL = { name: "", email: "", subject: "", message: "" };

const Contact = () => {
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    // Simulated API call – wire to a real endpoint when ready
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Message sent! We'll get back to you soon. 🎉");
    setForm(INITIAL);
  };

  return (
    <div className="min-h-screen py-12">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-indigo-600 mx-auto max-w-6xl px-8 py-16 mb-16 text-white text-center">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
          Get in touch
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          We'd love to hear<br className="hidden md:block" /> from you ✉️
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto">
          Have a question, suggestion, or just want to say hi? Drop us a message
          and our team will respond as soon as possible.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* ── Left Sidebar ── */}
        <aside className="lg:col-span-2 flex flex-col gap-6">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {contactInfo.map(({ icon, label, value, sub }) => (
              <div
                key={label}
                className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-4">Follow us on social</p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg transition-all duration-200 hover:text-white ${color} hover:scale-110`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Contact Form ── */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Send a Message</h2>
          <p className="text-sm text-gray-500 mb-8">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Delivery issue, Refund request…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us how we can help…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── FAQ strip ── */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { q: "How fast is delivery?", a: "We deliver within 30 minutes in most areas." },
            { q: "Can I track my order?", a: "Yes! Head to 'My Orders' to see real-time status." },
            { q: "What is your return policy?", a: "We offer hassle-free returns within 24 hours of delivery." },
            { q: "Are your products fresh?", a: "Absolutely. We source directly from farms daily." },
            { q: "Do you offer discounts?", a: "Yes, subscribe to a Silver or Gold plan for exclusive discounts." },
            { q: "How can I cancel my order?", a: "Contact support within 5 minutes of placing your order." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-1.5">❓ {q}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
