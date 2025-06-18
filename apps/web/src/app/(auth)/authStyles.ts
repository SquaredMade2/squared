import type { Elements } from "@clerk/types";

export const authStyles: Elements = {
	formButtonPrimary:
		"bg-primary! text-primary-foreground! hover:bg-primary/90! inline-flex! items-center! justify-center! rounded-md! text-sm! font-medium! ring-offset-background! transition-colors! focus-visible:outline-hidden! focus-visible:ring-2! focus-visible:ring-ring! focus-visible:ring-offset-2! disabled:pointer-events-none! disabled:opacity-50! h-10! px-4! py-2! w-full!",
	card: "bg-transparent! shadow-none!",
	header: "hidden!",
	footer: "hidden!",
	dividerLine: "bg-border!",
	formFieldLabel: "text-muted-foreground!",
	socialButtonsBlockButton: "bg-primary/20!",
	socialButtonsBlockButtonText: "text-foreground/80!",
	formFieldAction: "text-primary/60!",
	footerActionLink: "text-muted-foreground!",
	alternativeMethodsBlockButton: "bg-primary/20! text-foreground/80!",
	backLink: "text-muted-foreground!",
	otpCodeFieldInput:
		"border! border-primary! hover:border-primary/60! focus:border-primary/60! text-foreground!",
	formResendCodeLink: "text-muted-foreground!",
};
