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
  p: "skeleton-p w-[80%] my-3", // Default paragraph margins
  span: "skeleton-span w-[40%]",
  label: "skeleton-label w-[40%]",
};

let transformCache = new WeakMap<object, ReactNode>();

/**
 * Recursively transforms a node into its skeleton version.
 *
 * It accumulates parent's classes (lowercased) and if any of them include "text-center",
 * text nodes will be rendered with inline styles forcing center alignment.
 */
function transformNode(node: ReactNode, parentClasses: string = ""): ReactNode {
  console.log(node);
  // Handle text nodes first
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

  if (isValidElement<ExtendedElementProps>(node)) {
    console.log("valid", node);
    if (transformCache.has(node)) {
      return transformCache.get(node)!;
    }

    const { className = "", style, children } = node.props;
    const currentClasses = className;
    const isCentered =
      currentClasses.includes("text-center") ||
      parentClasses.includes("text-center");

    let result: ReactNode;

    // Handle image elements
    if (node.type === "img") {
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
      typeof node.type === "string" &&
      placeholderMapping[node.type]
    ) {
      result = (
        <div
          // Include original className to preserve margins
          className={`${className} skeleton-item ${
            placeholderMapping[node.type]
          } ${isCentered ? "mx-auto" : ""}`}
        />
      );
    }
    // Handle elements with children
    else {
      const newChildren = React.Children.map(children, (child) =>
        transformNode(child, currentClasses)
      );
      result = cloneElement(
        node,
        {
          className: `${className}`,
          style,
        },
        newChildren
      );
    }

    transformCache.set(node, result);
    return result;
  }

  if (Array.isArray(node)) {
    return node.map((child) => transformNode(child, parentClasses));
  }

  return node;
}

const MagicalSkeletonLoader: React.FC<MagicalSkeletonLoaderProps> = ({
  loading,
  children,
}) => {
  const skeletonContent = useMemo(() => {
    transformCache = new WeakMap(); // Reset cache on children change
    return transformNode(children);
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
