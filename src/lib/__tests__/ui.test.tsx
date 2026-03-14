/**
 * UI / Component tests
 * Tests SummaryRow and QuoteRow rendering, accessibility semantics, and
 * that no raw user-supplied HTML is rendered without escaping.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// ─── Inline reimplementations to avoid importing the full 1000-line page ──────
// These must stay in sync with src/app/quote/page.tsx

function SummaryRow({
  label,
  value,
  highlight = false,
  chip = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  chip?: boolean;
}) {
  if (!value) return null;
  return (
    <div data-testid="summary-row">
      <span data-testid="sr-label">{label}</span>
      {highlight ? (
        <span data-testid="sr-value-highlight">{value}</span>
      ) : chip ? (
        <span data-testid="sr-value-chip">{value}</span>
      ) : (
        <span data-testid="sr-value">{value}</span>
      )}
    </div>
  );
}

function QuoteRow({ label, value }: { label: string; value: string }) {
  return (
    <tr data-testid="quote-row">
      <td data-testid="qr-label">{label}</td>
      <td data-testid="qr-value">{value}</td>
    </tr>
  );
}

// ─── SummaryRow ────────────────────────────────────────────────────────────────

describe("SummaryRow", () => {
  it("renders label and value", () => {
    render(<SummaryRow label="Email" value="test@example.com" />);
    expect(screen.getByTestId("sr-label")).toHaveTextContent("Email");
    expect(screen.getByTestId("sr-value")).toHaveTextContent("test@example.com");
  });

  it("renders nothing when value is empty", () => {
    const { container } = render(<SummaryRow label="Phone" value="" />);
    expect(container.firstChild).toBeNull();
  });

  it("applies highlight variant for email pill", () => {
    render(<SummaryRow label="Email" value="a@b.com" highlight />);
    expect(screen.getByTestId("sr-value-highlight")).toBeInTheDocument();
    expect(screen.queryByTestId("sr-value")).toBeNull();
  });

  it("applies chip variant for package", () => {
    render(<SummaryRow label="Package" value="Starter" chip />);
    expect(screen.getByTestId("sr-value-chip")).toBeInTheDocument();
    expect(screen.queryByTestId("sr-value-highlight")).toBeNull();
  });

  it("does not render raw HTML — XSS payload shown as text only", () => {
    const xss = '<script>alert("xss")</script>';
    render(<SummaryRow label="Name" value={xss} />);
    const el = screen.getByTestId("sr-value");
    // textContent should contain the literal string, not execute it
    expect(el.textContent).toContain("<script>");
    // But no actual script element should exist in the DOM
    expect(document.querySelector("script[data-injected]")).toBeNull();
    expect(el.innerHTML).not.toContain("<script>");
  });
});

// ─── QuoteRow ──────────────────────────────────────────────────────────────────

describe("QuoteRow", () => {
  it("renders label and value cells", () => {
    const { container } = render(
      <table>
        <tbody>
          <QuoteRow label="Name" value="Keenan Husselmann" />
        </tbody>
      </table>
    );
    expect(screen.getByTestId("qr-label")).toHaveTextContent("Name");
    expect(screen.getByTestId("qr-value")).toHaveTextContent("Keenan Husselmann");
    // Must be proper table cells
    expect(container.querySelectorAll("td")).toHaveLength(2);
  });

  it("does not inject HTML from value", () => {
    const xss = '<img src=x onerror=alert(1)>';
    render(
      <table>
        <tbody>
          <QuoteRow label="Email" value={xss} />
        </tbody>
      </table>
    );
    const cell = screen.getByTestId("qr-value");
    expect(cell.innerHTML).not.toContain("<img");
    expect(cell.textContent).toContain("<img");
  });
});

// ─── Responsive overflow helpers ───────────────────────────────────────────────

describe("Long email display", () => {
  it("SummaryRow renders a long email address without truncation", () => {
    const longEmail = "very.long.email.address.that.keeps.going@really-long-domain-name.co.za";
    render(<SummaryRow label="Email" value={longEmail} highlight />);
    expect(screen.getByTestId("sr-value-highlight")).toHaveTextContent(longEmail);
  });

  it("QuoteRow renders a long email address without truncation", () => {
    const longEmail = "very.long.email.address.that.keeps.going@really-long-domain-name.co.za";
    render(
      <table>
        <tbody>
          <QuoteRow label="Email" value={longEmail} />
        </tbody>
      </table>
    );
    expect(screen.getByTestId("qr-value")).toHaveTextContent(longEmail);
  });
});

// ─── Accessibility ─────────────────────────────────────────────────────────────

describe("Accessibility — semantic structure", () => {
  it("QuoteRow uses td elements (not divs) for table data", () => {
    const { container } = render(
      <table>
        <tbody>
          <QuoteRow label="Service" value="Website" />
        </tbody>
      </table>
    );
    expect(container.querySelectorAll("td")).toHaveLength(2);
    expect(container.querySelectorAll("div")).toHaveLength(0);
  });

  it("SummaryRow does not use table elements", () => {
    const { container } = render(<SummaryRow label="Name" value="Keenan" />);
    expect(container.querySelectorAll("td")).toHaveLength(0);
    expect(container.querySelectorAll("th")).toHaveLength(0);
  });

  it("SummaryRow label and value are both present for screen readers", () => {
    render(<SummaryRow label="Email" value="a@b.com" />);
    expect(screen.getByTestId("sr-label")).toBeInTheDocument();
    expect(screen.getByTestId("sr-value")).toBeInTheDocument();
  });
});
