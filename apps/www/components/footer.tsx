import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";

export const Footer = () => {
	const links = [
		{
			name: "Pricing",
			href: "/pricing",
		},
		{
			name: "Blog",
			href: "/blog",
		},
		{
			name: "Docs",
			href: "/docs",
		},
		{
			name: "Contact",
			href: "/contact",
		},
	];
	// const legal: { name: string; href: string }[] = [
	// {
	//  name: "Privacy Policy",
	//  href: "#",
	// },
	// {
	//  name: "Terms of Service",
	//  href: "#",
	// },
	// {
	//  name: "Refund Policy",
	//  href: "#",
	// },
	// ];
	const socials = [
		// {
		//  name: "Twitter",
		//  href: "https://twitter.com/mannupaaji",
		// },
		{
			name: "LinkedIn",
			href: "https://www.linkedin.com/company/sqauredmade/mycompany/",
		},
		// {
		//  name: "GitHub",
		//  href: "https://github.com/manuarora700",
		// },
	];

	return (
		<footer className="relative bg-card text-foreground">
			<div className="container mx-auto max-w-7xl px-4 py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					<div className="space-y-4">
						<Logo className="justify-start" />
						<p className="text-muted-foreground text-sm">
							Empowering businesses with innovative solutions since 2024.
						</p>
						<div className="flex space-x-4">
							{socials.map((social) => (
								<Link key={social.name} href={social.href}>
									{social.name === "LinkedIn" && (
										<Linkedin className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
									)}
									{/* Commented social icons kept for future use */}
									{/* {social.name === "Twitter" && (
                    <Twitter className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                  )}
                  {social.name === "GitHub" && (
                    <Github className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                  )} */}
								</Link>
							))}
							<Link href="mailto:info@squared.com">
								<Mail className="h-6 w-6 text-muted-foreground transition-colors hover:text-foreground" />
							</Link>
						</div>
					</div>
					<div>
						<h3 className="mb-4 font-semibold">Quick Links</h3>
						<ul className="space-y-2">
							{links.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-muted-foreground text-sm transition-colors hover:text-foreground"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
					{/* <div>
						<h3 className="font-semibold mb-4">Legal</h3>
						<ul className="space-y-2">
							{legal.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
							<li>
								<Link
									href="#"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Refund Policy
								</Link>
							</li>
						</ul>
					</div> */}
					<div>
						<h3 className="mb-4 font-semibold">Stay Updated</h3>
						<p className="mb-4 text-muted-foreground text-sm">
							Subscribe to our newsletter for the latest updates and offers.
						</p>
						<form className="space-y-2">
							<Input type="email" placeholder="Enter your email" />
							<Button type="submit" className="w-full">
								Subscribe
							</Button>
						</form>
					</div>
				</div>
				<Separator className="my-8" />
				<div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
					<div className="text-muted-foreground text-sm">
						Copyright &copy; {new Date().getFullYear()} Squared
						<br />
						All rights reserved
					</div>
					<div className="flex space-x-4 text-muted-foreground text-sm">
						<div className="flex items-center">
							{/* <MapPin className="h-4 w-4 mr-2" /> */}
						</div>
						<div className="flex items-center">
							{/* <Phone className="h-4 w-4 mr-2" />
							+1 (555) 123-4567 */}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
