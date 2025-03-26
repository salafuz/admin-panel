export default defineAppConfig({
	ui: {
		card: {
			slots: {
				root: "rounded-lg shadow-lg",
				header: "p-6 border-b border-gray-300",
				body: "p-6",
				footer: "p-6 border-t border-gray-300",
			},
			variants: {
				variant: {
					outline: {
						root: "bg-white ring ring-gray-300 divide-y divide-gray-300",
					},
				},
			},
			defaultVariants: {
				variant: "outline",
			},
		},

		table: {
			slots: {
				root: "shadow-xl relative overflow-auto rounded-md",
				base: "min-w-full",
				thead: "bg-primary text-accent rounded-xl",
				tbody: "text-primary divide-y divide-gray-300",
				tr: "rounded-xl",
				th: "px-6 py-4 text-left font-semibold",
				td: "px-6 py-4 text-left",
			},
		},

		badge: {
			slots: {
				base: "font-medium inline-flex items-center px-3 py-1.5 rounded border bg-black",
				label: "truncate",
			},
			variants: {
				color: {
					primary: "bg-blue-600 text-white",
					success: "bg-green-600 text-white",
					warning: "bg-yellow-500 text-white",
					error: "bg-red-600 text-white",
				},
			},
			defaultVariants: {
				color: "primary",
			},
		},

		tabs: {
			slots: {
				root: "flex items-center gap-4 border-b border-gray-300",
				list: "flex gap-6",
				indicator: "absolute bottom-0 h-1 bg-blue-600",
				trigger: "px-4 py-2 font-medium text-gray-600 hover:text-gray-900",
			},
			defaultVariants: {
				color: "primary",
			},
		},
		input: {
			slots: {
				root: "relative inline-flex items-center",
				base: [
					"w-full rounded-[calc(var(--ui-radius)*1.5)] border-0 placeholder:text-(--ui-text-dimmed) focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
					"transition-colors",
				],
				leading: "absolute inset-y-0 start-0 flex items-center",
				leadingIcon: "shrink-0 text-(--ui-text-dimmed)",
				leadingAvatar: "shrink-0",
				leadingAvatarSize: "",
				trailing: "absolute inset-y-0 end-0 flex items-center",
				trailingIcon: "shrink-0 text-(--ui-text-dimmed)",
			},
			variants: {
				buttonGroup: {
					horizontal: {
						root: "group",
						base: "group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none",
					},
					vertical: {
						root: "group",
						base: "group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none",
					},
				},
				size: {
					xs: {
						base: "px-2 py-1 text-xs gap-1",
						leading: "ps-2",
						trailing: "pe-2",
						leadingIcon: "size-4",
						leadingAvatarSize: "3xs",
						trailingIcon: "size-4",
					},
					sm: {
						base: "px-2.5 py-1.5 text-xs gap-1.5",
						leading: "ps-2.5",
						trailing: "pe-2.5",
						leadingIcon: "size-4",
						leadingAvatarSize: "3xs",
						trailingIcon: "size-4",
					},
					md: {
						base: "px-2.5 py-1.5 text-sm gap-1.5",
						leading: "ps-2.5",
						trailing: "pe-2.5",
						leadingIcon: "size-5",
						leadingAvatarSize: "2xs",
						trailingIcon: "size-5",
					},
					lg: {
						base: "px-3 py-2 text-sm gap-2",
						leading: "ps-3",
						trailing: "pe-3",
						leadingIcon: "size-5",
						leadingAvatarSize: "2xs",
						trailingIcon: "size-5",
					},
					xl: {
						base: "px-3 py-2 text-base gap-2",
						leading: "ps-3",
						trailing: "pe-3",
						leadingIcon: "size-6",
						leadingAvatarSize: "xs",
						trailingIcon: "size-6",
					},
				},
				variant: {
					outline:
						"text-(--ui-text-highlighted) bg-(--ui-bg) ring ring-inset ring-(--ui-border-accented)",
					soft: "text-(--ui-text-highlighted) bg-(--ui-bg-elevated)/50 hover:bg-(--ui-bg-elevated) focus:bg-(--ui-bg-elevated) disabled:bg-(--ui-bg-elevated)/50",
					subtle:
						"text-(--ui-text-highlighted) bg-(--ui-bg-elevated) ring ring-inset ring-(--ui-border-accented)",
					ghost:
						"text-(--ui-text-highlighted) bg-transparent hover:bg-(--ui-bg-elevated) focus:bg-(--ui-bg-elevated) disabled:bg-transparent dark:disabled:bg-transparent",
					none: "text-(--ui-text-highlighted) bg-transparent",
				},
				color: {
					primary: "",
					secondary: "",
					success: "",
					info: "",
					warning: "",
					error: "",
					neutral: "",
				},
				leading: {
					true: "",
				},
				trailing: {
					true: "",
				},
				loading: {
					true: "",
				},
				highlight: {
					true: "",
				},
				type: {
					file: "file:me-1.5 file:font-medium file:text-(--ui-text-muted) file:outline-none",
				},
			},
			compoundVariants: [
				{
					color: "primary",
					variant: ["outline", "subtle"],
					class:
						"focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-primary)",
				},
				{
					color: "primary",
					highlight: true,
					class: "ring ring-inset ring-(--ui-primary)",
				},
				{
					color: "neutral",
					variant: ["outline", "subtle"],
					class:
						"focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-border-inverted)",
				},
				{
					color: "neutral",
					highlight: true,
					class: "ring ring-inset ring-(--ui-border-inverted)",
				},
				{
					leading: true,
					size: "xs",
					class: "ps-7",
				},
				{
					leading: true,
					size: "sm",
					class: "ps-8",
				},
				{
					leading: true,
					size: "md",
					class: "ps-9",
				},
				{
					leading: true,
					size: "lg",
					class: "ps-10",
				},
				{
					leading: true,
					size: "xl",
					class: "ps-11",
				},
				{
					trailing: true,
					size: "xs",
					class: "pe-7",
				},
				{
					trailing: true,
					size: "sm",
					class: "pe-8",
				},
				{
					trailing: true,
					size: "md",
					class: "pe-9",
				},
				{
					trailing: true,
					size: "lg",
					class: "pe-10",
				},
				{
					trailing: true,
					size: "xl",
					class: "pe-11",
				},
				{
					loading: true,
					leading: true,
					class: {
						leadingIcon: "animate-spin",
					},
				},
				{
					loading: true,
					leading: false,
					trailing: true,
					class: {
						trailingIcon: "animate-spin",
					},
				},
			],
			defaultVariants: {
				size: "md",
				color: "primary",
				variant: "outline",
			},
		},
	},
});
