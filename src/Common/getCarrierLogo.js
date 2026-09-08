import Bluedart from "../assets/bluedart.png";
import Delehivery from "../assets/delehivery.png";
import EcomExpress from "../assets/ecom-expresss.avif";
import Shadowfax from "../assets/shadowfax.png";
import Xpressbees from "../assets/xpressbees.png";
import Shiprocket from "../assets/shiprocket.webp";
import NimbusPost from "../assets/nimbuspost.webp";
import ShreeMaruti from "../assets/shreemaruti.png";
import Amazon from "../assets/amazon.jpg";
import Smartship from "../assets/bluedart.png";
import DTDC from "../assets/dtdc.png";
import Ekart from "../assets/ekart.png";
import Shiproxx from "../assets/shiproxxNoBG.png"
import ShipexIndia from "../assets/shipexindia.png"

// Generic gray package icon shown whenever the service name doesn't match a
// known carrier, so callers always get a valid <img src> instead of a
// broken-image icon. Built from plain shapes (not a copied icon glyph) so
// there's no risk of malformed path data.
const DefaultCourierIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='7' width='18' height='13' rx='1.5'/%3E%3Cpath d='M3 7l9-4 9 4'/%3E%3Cpath d='M12 3v17'/%3E%3C/svg%3E";

export const getCarrierLogo = (courierServiceName = "") => {
  const name = courierServiceName?.toLowerCase();

  if (name?.includes("delhivery")) return Delehivery;
  if (name?.includes("bluedart")) return Bluedart;
  if (name?.includes("ecom")) return EcomExpress;
  if (name?.includes("shadowfax")) return Shadowfax;
  if (name?.includes("xpressbees")) return Xpressbees;
  if (name?.includes("nimbus")) return NimbusPost;
  if (name?.includes("shiprocket")) return Shiprocket;
  if (name?.includes("shree")) return ShreeMaruti;
  if (name?.includes("dtdc")) return DTDC;
  if (name?.includes("amazon")) return Amazon;
  if (name?.includes("smartship")) return Smartship;
  if (name?.includes("ekart")) return Ekart;
  if (name?.includes("shiproxx")) return Shiproxx;
  if (name?.includes("shipex")) return ShipexIndia;
  if (name?.includes("boxd")) return DefaultCourierIcon;   // BoxdLogistics – add logo asset when available

  return DefaultCourierIcon; // no match — generic fallback instead of a broken image
};
