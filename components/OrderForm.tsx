"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

type Labels = {
  name: string;
  email: string;
  site: string;
  message: string;
  submit: string;
  emailSubject: string;
  selectedServicesLabel?: string;
};

export function OrderForm({ labels }: { labels: Labels }) {
  // выбранные на странице услуг пункты приходят через ?services= (по строке на услугу)
  const selectedServices: string[] = (() => {
    if (typeof window === "undefined") return [];
    const raw = new URLSearchParams(window.location.search).get("services");
    if (!raw) return [];
    return raw.split("\n").map((s) => s.trim()).filter(Boolean);
  })();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [message, setMessage] = useState("");

  const servicesHead = labels.selectedServicesLabel ?? "Выбранные услуги";

  const handleSubmit = () => {
    const to = siteConfig.contacts.email;
    const subject = encodeURIComponent(labels.emailSubject);
    const servicesBlock =
      selectedServices.length > 0
        ? `${servicesHead}:\n${selectedServices.join("\n")}\n\n`
        : "";
    const body = encodeURIComponent(
      servicesBlock +
        `${labels.name}: ${name}\n` +
        `${labels.email}: ${email}\n` +
        `${labels.site}: ${site}\n\n` +
        `${labels.message}:\n${message}\n`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const inputClass =
    "mt-1 block w-full rounded-md border border-neutral-300 px-4 py-3 text-base " +
    "focus:border-[#0f3460] focus:outline-none focus:ring-1 focus:ring-[#0f3460]";

  return (
    <div className="mt-6 space-y-5">
      {/* Чёткий блок выбранного — сразу видно, что человек выбрал */}
      {selectedServices.length > 0 && (
        <div className="rounded-[16px] border border-[#1a4a7a]/20 bg-[#1a4a7a]/[0.06] p-5">
          <p className="text-base font-bold text-[#1a4a7a]">{servicesHead}:</p>
          <ul className="mt-3 space-y-2">
            {selectedServices.map((s, i) => (
              <li key={i} className="flex gap-2.5 leading-snug">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1a4a7a]" />
                <span className="text-base text-neutral-800">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-base font-medium text-neutral-800">
          {labels.name}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-base font-medium text-neutral-800">
          {labels.email}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-base font-medium text-neutral-800">
          {labels.site}
        </label>
        <input
          type="text"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-base font-medium text-neutral-800">
          {labels.message}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className={inputClass}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="block w-full rounded-md bg-[#0f3460] px-6 py-3 text-center text-base font-medium text-white transition-colors hover:bg-[#0c2a4d]"
      >
        {labels.submit}
      </button>
    </div>
  );
}
