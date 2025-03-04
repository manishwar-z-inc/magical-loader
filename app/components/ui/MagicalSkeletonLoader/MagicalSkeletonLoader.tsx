"use client";

import React, { ReactNode, isValidElement, cloneElement, useMemo } from "react";
import "./MagicalSkeletonLoader.css";

interface MagicalSkeletonLoaderProps {
  loading: boolean;
  children: ReactNode;
}

interface ExtendedElementProps extends React.HTMLAttributes<HTMLElement> {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const placeholderMapping: Record<string, string> = {
  h1: "skeleton-h1 w-[70%] my-4", // Default h1 margins
  h2: "skeleton-h2 w-[65%] my-3", // Default h2 margins
  h3: "skeleton-h3 w-[60%] my-2", // Default h3 margins
  h4: "skeleton-h4 w-[55%] my-2", // Default h4 margins
  h5: "skeleton-h5 w-[50%] my-1", // Default h5 margins
  h6: "skeleton-h6 w-[45%] my-1", // Default h6 margins
  p: "skeleton-p w-[80%] my-3",    // Default paragraph margins
  span: "skeleton-span w-[40%]",
  label: "skeleton-label w-[40%]",
};

/**
 * Recursively transforms a node into its skeleton version.
 *
 * Custom components (non-DOM elements) are skipped.
 * We wrap the transformation of children in try/catch blocks to avoid errors.
 */
function transformNode(
  node: ReactNode,
  parentClasses: string = "",
  cache: WeakMap<object, ReactNode>
): ReactNode {
  // Handle text nodes
  if (typeof node === "string" || typeof node === "number") {
    const isCentered = parentClasses.includes("text-center");
    return (
      <div
        className={`skeleton-item skeleton-text ${
          isCentered ? "w-10/12 mx-auto" : "w-1/2"
        } h-4 my-2`}
      />
    );
  }

  if (isValidElement(node)) {
    if (cache.has(node)) {
      return cache.get(node)!;
    }

    // Skip transformation for custom components
    if (node.type !== React.Fragment && typeof node.type !== "string") {
      return node;
    }

    const { className = "", style, children } = node.props as ExtendedElementProps;
    const currentClasses = className;
    const isCentered =
      currentClasses.includes("text-center") ||
      parentClasses.includes("text-center");

    let result: ReactNode;

    // Handle React fragments
    if (node.type === React.Fragment) {
      let newChildren;
      try {
        newChildren = React.Children.map(children, (child) =>
          transformNode(child, currentClasses, cache)
        );
      } catch (e) {
        newChildren = children;
      }
      result = <>{newChildren}</>;
    }
    // Handle image elements by returning a placeholder div
    else if (node.type === "img") {
      result = (
        <div
          className={`${className} skeleton-item skeleton-img ${
            isCentered ? "mx-auto" : ""
          }`}
          style={style}
        />
      );
    }
    // Handle empty elements with placeholder mapping
    else if (
      (children === null ||
        children === undefined ||
        (typeof children === "string" && children.trim() === "")) &&
      placeholderMapping[node.type as string]
    ) {
      result = (
        <div
          className={`${className} skeleton-item ${
            placeholderMapping[node.type as string]
          } ${isCentered ? "mx-auto" : ""}`}
        />
      );
    }
    // Handle other DOM elements with children
    else {
      let newChildren;
      try {
        newChildren = React.Children.map(children, (child) =>
          transformNode(child, currentClasses, cache)
        );
      } catch (e) {
        newChildren = children;
      }
      try {
        result = cloneElement(node as React.ReactElement<any>, { className, style }, newChildren);
      } catch (e) {
        result = node;
      }
    }

    cache.set(node, result);
    return result;
  }

  if (Array.isArray(node)) {
    return node.map((child) => transformNode(child, parentClasses, cache));
  }

  return node;
}

const MagicalSkeletonLoader: React.FC<MagicalSkeletonLoaderProps> = ({
  loading,
  children,
}) => {
  const skeletonContent = useMemo(() => {
    // Create a fresh cache for each render
    const localCache = new WeakMap<object, ReactNode>();
    return transformNode(children, "", localCache);
  }, [children]);

  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div className="skeleton-container">
      <div className="skeleton-overlay"></div>
      {skeletonContent}
    </div>
  );
};

export default MagicalSkeletonLoader;
