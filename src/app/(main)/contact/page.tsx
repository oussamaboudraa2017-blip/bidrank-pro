"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Send,
  MessageSquare,
  Clock,
  Phone,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

const contactMethods = [
  {
    icon: MessageSquare,
    label: "Support",
    email: "support@bidrank.pro",
    description: "Technical issues, account help, feature questions",
  },
  {
    icon: Building2,
    label: "Sales",
    email: "sales@bidrank.pro",
    description: "Pricing, enterprise plans, custom solutions",
  },
  {
    icon: Handshake,
    label: "Partnerships",
    email: "partnerships@bidrank.pro",
    description: "SBDC, PTAC, association partnerships",
  },
];

// Suppress unused import warning for Handshake used above
import { Handshake } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message sent!", {
        description:
          "We'll respond within 24 hours on business days. Thanks for reaching out.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or partnership inquiry? We&apos;re here
            to help and typically respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h2 className="font-heading text-xl font-bold text-br-primary mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-name"
                          className="text-sm font-medium text-br-dark"
                        >
                          Name
                        </label>
                        <Input
                          id="contact-name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="contact-email"
                          className="text-sm font-medium text-br-dark"
                        >
                          Email
                        </label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="you@company.com"
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
                        htmlFor="contact-subject"
                        className="text-sm font-medium text-br-dark"
                      >
                        Subject
                      </label>
                      <Select
                        value={formData.subject}
                        onValueChange={(v) =>
                          setFormData({ ...formData, subject: v })
                        }
                        required
                      >
                        <SelectTrigger id="contact-subject">
                          <SelectValue placeholder="What is this about?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="support">
                            Technical Support
                          </SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="contact-message"
                        className="text-sm font-medium text-br-dark"
                      >
                        Message
                      </label>
                      <Textarea
                        id="contact-message"
                        placeholder="How can we help you?"
                        rows={6}
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
                      className="w-full sm:w-auto bg-br-accent hover:bg-br-accent/90 text-br-primary font-semibold"
                    >
                      {submitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Response Time */}
              <Card className="bg-br-accent/5 border-br-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-br-accent/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-br-accent" />
                    </div>
                    <h3 className="font-heading font-bold text-br-primary">
                      Response Time
                    </h3>
                  </div>
                  <p className="text-sm text-br-text-secondary leading-relaxed">
                    We respond within <strong>24 hours</strong> on business days.
                    For urgent support, include &quot;URGENT&quot; in your
                    subject and we&apos;ll prioritize your request.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Methods */}
              <Card>
                <CardContent className="p-6 space-y-5">
                  <h3 className="font-heading font-bold text-br-primary flex items-center gap-2">
                    <Mail className="h-4 w-4 text-br-accent" />
                    Direct Email
                  </h3>
                  {contactMethods.map((method) => (
                    <div key={method.email} className="group">
                      <div className="flex items-center gap-2 mb-0.5">
                        <method.icon className="h-4 w-4 text-br-secondary" />
                        <span className="text-sm font-medium text-br-primary">
                          {method.label}
                        </span>
                      </div>
                      <a
                        href={`mailto:${method.email}`}
                        className="text-sm text-br-secondary hover:text-br-primary transition-colors pl-6"
                      >
                        {method.email}
                      </a>
                      <p className="text-xs text-br-text-secondary pl-6 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}