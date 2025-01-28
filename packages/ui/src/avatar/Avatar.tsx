import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	type HTMLAttributeReferrerPolicy,
	forwardRef,
	useEffect,
	useState,
} from "react";
import { createContextScope } from "../context";
import type { Scope } from "../context";
import { Primitive } from "../react-primitive";
import { useCallbackRef } from "../use-callback-ref";
import { useLayoutEffect } from "../use-layout-effect";

/* -------------------------------------------------------------------------------------------------
 * Avatar
 * -----------------------------------------------------------------------------------------------*/

const AVATAR_NAME = "Avatar";

type ScopedProps<P> = P & { __scopeAvatar?: Scope };
const [createAvatarContext, createAvatarScope] =
	createContextScope(AVATAR_NAME);

type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

type AvatarContextValue = {
	imageLoadingStatus: ImageLoadingStatus;
	onImageLoadingStatusChange(status: ImageLoadingStatus): void;
};

const [AvatarProvider, useAvatarContext] =
	createAvatarContext<AvatarContextValue>(AVATAR_NAME);

type AvatarElement = ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = ComponentPropsWithoutRef<typeof Primitive.span>;
interface AvatarProps extends PrimitiveSpanProps {}

const Avatar = forwardRef<AvatarElement, AvatarProps>(
	(props: ScopedProps<AvatarProps>, forwardedRef) => {
		const { __scopeAvatar, ...avatarProps } = props;
		const [imageLoadingStatus, setImageLoadingStatus] =
			useState<ImageLoadingStatus>("idle");
		return (
			<AvatarProvider
				scope={__scopeAvatar}
				imageLoadingStatus={imageLoadingStatus}
				onImageLoadingStatusChange={setImageLoadingStatus}
			>
				<Primitive.span {...avatarProps} ref={forwardedRef} />
			</AvatarProvider>
		);
	},
);

Avatar.displayName = AVATAR_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarImage
 * -----------------------------------------------------------------------------------------------*/

const IMAGE_NAME = "AvatarImage";

type AvatarImageElement = ElementRef<typeof Primitive.img>;
type PrimitiveImageProps = ComponentPropsWithoutRef<typeof Primitive.img>;
interface AvatarImageProps extends PrimitiveImageProps {
	onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

const AvatarImage = forwardRef<AvatarImageElement, AvatarImageProps>(
	(props: ScopedProps<AvatarImageProps>, forwardedRef) => {
		const {
			__scopeAvatar,
			src,
			onLoadingStatusChange = () => {},
			...imageProps
		} = props;
		const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
		const imageLoadingStatus = useImageLoadingStatus(
			src,
			imageProps.referrerPolicy,
		);
		const handleLoadingStatusChange = useCallbackRef(
			(status: ImageLoadingStatus) => {
				onLoadingStatusChange(status);
				context.onImageLoadingStatusChange(status);
			},
		);

		useLayoutEffect(() => {
			if (imageLoadingStatus !== "idle") {
				handleLoadingStatusChange(imageLoadingStatus);
			}
		}, [imageLoadingStatus, handleLoadingStatusChange]);

		return imageLoadingStatus === "loaded" ? (
			<Primitive.img {...imageProps} ref={forwardedRef} src={src} />
		) : null;
	},
);

AvatarImage.displayName = IMAGE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = "AvatarFallback";

type AvatarFallbackElement = ElementRef<typeof Primitive.span>;
interface AvatarFallbackProps extends PrimitiveSpanProps {
	delayMs?: number;
}

const AvatarFallback = forwardRef<AvatarFallbackElement, AvatarFallbackProps>(
	(props: ScopedProps<AvatarFallbackProps>, forwardedRef) => {
		const { __scopeAvatar, delayMs, ...fallbackProps } = props;
		const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
		const [canRender, setCanRender] = useState(delayMs === undefined);

		useEffect(() => {
			if (delayMs !== undefined) {
				const timerId = window.setTimeout(() => setCanRender(true), delayMs);
				return () => window.clearTimeout(timerId);
			}
		}, [delayMs]);

		return canRender && context.imageLoadingStatus !== "loaded" ? (
			<Primitive.span {...fallbackProps} ref={forwardedRef} />
		) : null;
	},
);

AvatarFallback.displayName = FALLBACK_NAME;

/* -----------------------------------------------------------------------------------------------*/

function useImageLoadingStatus(
	src?: string,
	referrerPolicy?: HTMLAttributeReferrerPolicy,
) {
	const [loadingStatus, setLoadingStatus] =
		useState<ImageLoadingStatus>("idle");

	useLayoutEffect(() => {
		if (!src) {
			setLoadingStatus("error");
			return;
		}

		let isMounted = true;
		const image = new window.Image();

		const updateStatus = (status: ImageLoadingStatus) => () => {
			if (!isMounted) return;
			setLoadingStatus(status);
		};

		setLoadingStatus("loading");
		image.onload = updateStatus("loaded");
		image.onerror = updateStatus("error");
		image.src = src;
		if (referrerPolicy) {
			image.referrerPolicy = referrerPolicy;
		}

		return () => {
			isMounted = false;
		};
	}, [src, referrerPolicy]);

	return loadingStatus;
}
const Root = Avatar;
const Image = AvatarImage;
const Fallback = AvatarFallback;

export {
	createAvatarScope,
	//
	Avatar,
	AvatarImage,
	AvatarFallback,
	//
	Root,
	Image,
	Fallback,
};
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
