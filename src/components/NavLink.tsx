import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps
  extends Omit<ComponentPropsWithoutRef<typeof Link>, "className"> {
  href: string;
  className?: string | ((props: { isActive: boolean }) => string);
  activeClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href || pathname?.startsWith(href + "/");

    const computedClassName =
      typeof className === "function"
        ? className({ isActive })
        : cn(className, isActive && activeClassName);

    return (
      <Link ref={ref} href={href} className={computedClassName} {...props} />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
