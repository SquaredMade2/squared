import { Button } from "@squaredmade/ui/button";
import { cn } from "@squaredmade/ui/cn";
import { Close, type IconName, LokeIcon } from "@squaredmade/ui/icons";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	icon?: IconName;
	onClear?: () => void;
};

/**
 * Input component for text input fields
 *
 * The Input component provides a flexible and customizable text input field that can be used for various types of user input. It's designed to maintain consistent styling across your application while allowing for easy customization.
 *
 * Key features:
 * - Supports common input types: text, password, email, and number
 * - Consistent styling with other form components
 * - Customizable appearance through className prop
 * - Accessible focus states
 * - Support for disabled state
 * - File input styling
 * - Optional icon support
 *
 * Usage considerations:
 * - Use appropriate input types for different kinds of data (e.g., 'email' for email addresses)
 * - Provide clear labels or placeholders to indicate the expected input
 * - Consider using the 'required' attribute for mandatory fields
 * - Implement proper form validation for user inputs
 * - Ensure sufficient color contrast for placeholder text
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, icon, onClear, ...props }, ref) => {
		const classes = cn(
			"flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background",
			"file:border-0 file:bg-transparent file:text-sm file:font-medium",
			"placeholder:text-muted-foreground",
			"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			"disabled:cursor-not-allowed disabled:opacity-50",
			icon && "pl-8",
			className,
		);
		if (icon || onClear) {
			return (
				<div className="relative">
					{icon && (
						<div className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3">
							<LokeIcon icon={icon} size="sm" />
						</div>
					)}
					<input type={type} className={classes} ref={ref} {...props} />
					{onClear && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-0 right-3"
							onClick={onClear}
						>
							<Close size="sm" />
						</Button>
					)}
				</div>
			);
		}

		return <input type={type} className={classes} ref={ref} {...props} />;
	},
);
Input.displayName = "Input";

export { Input };
