"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Handshake,
  Building2,
  Award,
  Rocket,
  CheckCircle2,
  Mail,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export default function PartnersPage() {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    type: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Application submitted!", {
        description:
          "Our partnerships team will review your application and respond within 3 business days.",
      });
      setFormData({
        name: "",
        organization: "",
        type: "",
        email: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-br-accent/10 text-br-accent text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
            <Handshake className="h-4 w-4" />
            Partnership Program
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Partner with BidRank
          </h1>
          <p className="text-lg text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
            Join our growing network of SBDCs, PTACs, SCORE chapters, and
            industry associations helping small businesses win federal contracts.
          </p>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="bg-br-surface py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-3">
              Partnership Tiers
            </h2>
            <p className="text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
              Choose the partnership level that fits your organization&apos;s
              goals and capacity.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Community Partner */}
            <Card className="bg-br-surface border-br-border rounded-xl shadow-br-sm relative overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-br-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-br-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-br-primary mb-1">
                  Community Partner
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-br-success/10 text-br-success border-0 mb-4 text-xs"
                >
                  Free
                </Badge>
                <p className="text-sm text-br-text-secondary mb-6 leading-relaxed">
                  For organizations that want to share BidRank with their
                  community of small businesses.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Co-branded referral link",
                    "Quarterly partner newsletter",
                    "BidRank logo for your site",
                    "Resource sharing permissions",
                    "Community Slack channel access",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-br-text-secondary"
                    >
                      <CheckCircle2 className="h-4 w-4 text-br-success shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Premium Partner - Featured */}
            <Card className="bg-br-surface border-br-border rounded-xl shadow-br-sm relative overflow-hidden border-2 border-br-accent">
              <div className="absolute top-0 right-0 bg-br-accent text-br-primary text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <CardContent className="p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-br-accent/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-br-accent" />
                </div>
                <h3 className="font-heading text-xl font-bold text-br-primary mb-1">
                  Premium Partner
                </h3>
                <Badge className="bg-br-accent/10 text-br-accent border-br-accent/20 mb-4 text-xs">
                  Co-Branded
                </Badge>
                <p className="text-sm text-br-text-secondary mb-6 leading-relaxed">
                  For organizations ready to deeply integrate BidRank into
                  their client services.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in Community",
                    "Free Pro accounts for your team",
                    "Co-branded training materials",
                    "Priority support channel",
                    "Partner dashboard & analytics",
                    "Monthly co-marketing opportunities",
                    "Early access to new features",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-br-text-secondary"
                    >
                      <CheckCircle2 className="h-4 w-4 text-br-accent shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Strategic Partner */}
            <Card className="bg-br-surface border-br-border rounded-xl shadow-br-sm relative overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="w-12 h-12 rounded-xl bg-br-secondary/10 flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-br-secondary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-br-primary mb-1">
                  Strategic Partner
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-br-secondary/10 text-br-secondary border-0 mb-4 text-xs"
                >
                  Custom
                </Badge>
                <p className="text-sm text-br-text-secondary mb-6 leading-relaxed">
                  For large organizations, associations, and platforms seeking
                  deep technical integrations.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in Premium",
                    "Custom API integrations",
                    "White-label options available",
                    "Dedicated account manager",
                    "Custom reporting & dashboards",
                    "Joint product development",
                    "Revenue sharing opportunities",
                    "Executive quarterly reviews",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-br-text-secondary"
                    >
                      <CheckCircle2 className="h-4 w-4 text-br-secondary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="bg-br-light py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Mail className="h-10 w-10 text-br-accent mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-3">
              Apply to Become a Partner
            </h2>
            <p className="text-br-text-secondary leading-relaxed">
              Tell us about your organization and how you&apos;d like to work
              together. We&apos;ll respond within 3 business days.
            </p>
          </div>

          <Card className="bg-br-surface border-br-border rounded-xl shadow-br-sm">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="partner-name"
                      className="text-sm font-medium text-br-dark"
                    >
                      Full Name
                    </label>
                    <Input
                      id="partner-name"
                      placeholder="Jane Smith"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="partner-org"
                      className="text-sm font-medium text-br-dark"
                    >
                      Organization
                    </label>
                    <Input
                      id="partner-org"
                      placeholder="SBDC Central Region"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="partner-type"
                      className="text-sm font-medium text-br-dark"
                    >
                      Organization Type
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) =>
                        setFormData({ ...formData, type: v })
                      }
                      required
                    >
                      <SelectTrigger id="partner-type">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sbdc">SBDC</SelectItem>
                        <SelectItem value="ptac">PTAC</SelectItem>
                        <SelectItem value="score">SCORE</SelectItem>
                        <SelectItem value="association">
                          Industry Association
                        </SelectItem>
                        <SelectItem value="government">
                          Government Agency
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="partner-email"
                      className="text-sm font-medium text-br-dark"
                    >
                      Work Email
                    </label>
                    <Input
                      id="partner-email"
                      type="email"
                      placeholder="jane@organization.org"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="partner-message"
                    className="text-sm font-medium text-br-dark"
                  >
                    Message
                  </label>
                  <Textarea
                    id="partner-message"
                    placeholder="Tell us about your organization and how you'd like to partner with BidRank..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-br-accent hover:bg-br-accent/90 text-br-primary font-semibold"
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Application
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-br-text-secondary mt-6">
            Questions? Email us at{" "}
            <a
              href="mailto:partnerships@bidrank.pro"
              className="text-br-primary hover:underline font-medium"
            >
              partnerships@bidrank.pro
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}