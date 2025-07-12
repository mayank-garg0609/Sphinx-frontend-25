import dynamic from "next/dynamic";
import { LoadingPlaceholder } from "./loadingPlaceholder";

export const iconComponents = {
  FaInstagram: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaInstagram })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-5 h-5" />,
    }
  ),
  FaLinkedin: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaLinkedin })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-5 h-5" />,
    }
  ),
  FaFacebook: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaFacebook })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-5 h-5" />,
    }
  ),
  FaBars: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaBars })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-6 h-6" />,
    }
  ),
  FaTimes: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaTimes })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-8 h-8" />,
    }
  ),
  FaUser: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaUser })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-4 h-4" />,
    }
  ),
};
