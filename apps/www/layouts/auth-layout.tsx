// import { FeaturedTestimonials } from "@/components/featured-testimonials";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { cn } from "@/lib/utils";

export function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
				{children}
				<div className="relative z-20 hidden w-full items-center justify-center overflow-hidden border-neutral-100 border-l bg-gray-50 md:flex dark:border-neutral-800 dark:bg-neutral-900">
					<div className="mx-auto max-w-sm">
						{/* <FeaturedTestimonials /> */}
						<p
							className={cn(
								"text-center font-semibold text-muted text-xl dark:text-muted-dark",
							)}
						>
							Every AI is used by thousands of users
						</p>
						<p
							className={cn(
								"mt-8 text-center font-normal text-base text-neutral-500 dark:text-neutral-400",
							)}
						>
							With lots of AI applications around, Everything AI stands out with
							its state of the art Shitposting capabilities.
						</p>
					</div>
					<HorizontalGradient className="top-20" />
					<HorizontalGradient className="bottom-20" />
					<HorizontalGradient className="-right-80 inset-y-0 h-full rotate-90 scale-x-150 transform" />
					<HorizontalGradient className="-left-80 inset-y-0 h-full rotate-90 scale-x-150 transform" />
				</div>
			</div>
		</>
	);
}
