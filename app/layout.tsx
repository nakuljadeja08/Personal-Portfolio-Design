import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import "@/styles/globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
// Same file, separate fallback: plain Arial is within a few percent of Archivo at 800/112%, so headlines
// keep their line breaks when the font swaps in. The usual adjusted fallback is sized for body text.
const archivoDisplay = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo-display",
  display: "swap",
  adjustFontFallback: false,
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const title = "Nakul Jadeja · Data Engineer";
const description = "Data engineer building pipelines with traceable lineage. Open to data engineering roles in fintech, banking and financial services.";

// Vercel provides the domain. Share images need an absolute URL, and this stays right when the domain changes.
const domain = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(domain ? `https://${domain}` : "http://localhost:3000"),
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image" },
};

// Runs before first paint so a saved DAY / NIGHT choice never flashes the wrong theme.
const themeScript = `try{var t=localStorage.getItem("nl-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

// Dev only: Edge's form filling stamps fdprocessedid on every button before React hydrates, which the dev
// overlay reports as a mismatch. It can't affect visitors, because production builds don't run this check.
const stripFormFillerAttribute = `new MutationObserver(function(records){records.forEach(function(r){if(r.attributeName==="fdprocessedid")r.target.removeAttribute("fdprocessedid");r.addedNodes&&r.addedNodes.forEach(function(n){if(n.querySelectorAll){if(n.hasAttribute("fdprocessedid"))n.removeAttribute("fdprocessedid");n.querySelectorAll("[fdprocessedid]").forEach(function(e){e.removeAttribute("fdprocessedid")})}})})}).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:["fdprocessedid"]});`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${archivoDisplay.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {process.env.NODE_ENV === "development" && (
          <script dangerouslySetInnerHTML={{ __html: stripFormFillerAttribute }} />
        )}
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
