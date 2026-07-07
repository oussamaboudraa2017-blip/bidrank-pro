"use client";

import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  FileCheck,
  MapPin,
  ClipboardList,
  Globe,
  Scale,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  ChevronDown,
  ExternalLink,
  Lock,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Resource Guide Data ────────────────────────────────────────────────────

interface GuideSection {
  title: string;
  content: string;
}

interface ResourceGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeColor: string;
  category: string;
  readTime: string;
  externalLink?: string;
  sections: GuideSection[];
}

const resourceGuides: ResourceGuide[] = [
  {
    id: "8a-certification",
    title: "8(a) Business Development Program Guide",
    description:
      "Complete guide to the SBA 8(a) certification — eligibility, application process, timeline, benefits, and how to leverage set-aside contracts for your small business.",
    icon: ShieldCheck,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
    badge: "Essential",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    category: "Certification",
    readTime: "12 min",
    externalLink: "https://www.sba.gov/federal-contracting/contracting-programs/8a-business-development-program",
    sections: [
      {
        title: "What is the 8(a) Program?",
        content:
          "The 8(a) Business Development Program is a 9-year program created by the U.S. Small Business Administration (SBA) to help small, disadvantaged businesses compete in the federal marketplace. The program provides participants with access to sole-source and competitive set-aside contracts, business development support, and mentorship opportunities through the Mentor-Protégé Program. It is one of the most valuable certifications a small business can obtain for federal contracting, as it opens doors to contracts that are reserved exclusively for 8(a) firms. The program is named after Section 8(a) of the Small Business Act, which authorizes the SBA to provide business development assistance to socially and economically disadvantaged firms.",
      },
      {
        title: "Eligibility Requirements",
        content:
          "To qualify for the 8(a) program, your business must meet several criteria. First, it must be a small business as defined by SBA size standards for its primary NAICS code. The owner must be a U.S. citizen who is socially and economically disadvantaged. Social disadvantage is presumed for members of certain groups including Black Americans, Hispanic Americans, Native Americans, Asian Pacific Americans, and Subcontinent Asian Americans. Others can apply by showing a pattern of disadvantage through evidence of discrimination. Economic disadvantage means the owner's personal net worth (excluding equity in the business and primary residence) must be under $750,000, and their adjusted gross income averaged over the past three years must be under $400,000. The owner must also have good character and demonstrate potential for success.",
      },
      {
        title: "Application Process & Timeline",
        content:
          "The application is submitted through the SBA's Certify.SBA.gov portal. You will need to create an account, complete the application with detailed information about your business ownership, finances, and personal background, and upload supporting documentation including tax returns, financial statements, and personal financial records. The SBA typically reviews applications within 60-90 days, though it can take longer if additional information is requested. Once approved, your business enters the program for a total of 9 years: 4 years in the developmental stage and 5 years in the transitional stage. During the developmental stage, you can receive sole-source contracts up to $4.5 million for goods and services or $7 million for manufacturing. During the transitional stage, the competitive threshold increases and you are expected to compete more broadly.",
      },
      {
        title: "Key Benefits",
        content:
          "The 8(a) program offers several powerful advantages. Sole-source contracts allow agencies to award contracts directly to your firm without competition, up to the statutory thresholds. Competitive 8(a) set-asides limit competition to other 8(a) firms only, dramatically reducing the competitive field. You also gain access to the Mentor-Protégé Program, where an experienced federal contractor can mentor your business through joint ventures and teaming arrangements. Additionally, 8(a) firms can form joint ventures with other small businesses to pursue larger contracts. The program also provides business development assistance including training, counseling, and access to capital through SBA-backed loans.",
      },
      {
        title: "Common Mistakes to Avoid",
        content:
          "Many applicants fail because of preventable errors. The most common is incomplete financial documentation — the SBA requires three years of personal and business tax returns, and missing even one can delay or derail your application. Another frequent mistake is not clearly demonstrating social disadvantage if you are not in a presumed group. You need a detailed narrative with specific examples, not just a general statement. Ownership and control issues are also a major stumbling block — the SBA will examine whether the disadvantaged owner truly controls day-to-day operations and strategic decisions. Having a non-disadvantaged individual who makes key business decisions, holds a large equity stake, or controls the board can lead to denial. Finally, ensure your SAM.gov registration and CAGE code are active before applying, as these are prerequisites.",
      },
    ],
  },
  {
    id: "hubzone-eligibility",
    title: "HUBZone Eligibility & Application Guide",
    description:
      "Everything you need to know about the Historically Underutilized Business Zone program — qualification criteria, how to verify your address, and maintaining compliance.",
    icon: MapPin,
    iconColor: "text-br-text-secondary",
    iconBg: "bg-blue-100",
    badge: "Essential",
    badgeColor: "bg-blue-100 text-br-text-secondary border-blue-300",
    category: "Certification",
    readTime: "10 min",
    externalLink: "https://www.sba.gov/federal-contracting/contracting-programs/hubzone-program",
    sections: [
      {
        title: "What is the HUBZone Program?",
        content:
          "The HUBZone (Historically Underutilized Business Zone) program is a federal contracting program administered by the SBA that provides contracting assistance to small businesses located in historically underutilized business zones. The goal is to stimulate economic development and create jobs in these areas by providing federal contracting preferences. HUBZone-certified businesses receive a 10% price evaluation preference in full and open contract competitions and can compete for contracts that are set aside exclusively for HUBZone firms. Unlike the 8(a) program, HUBZone eligibility is based on the location of your principal office and where your employees live, not the owner's personal background.",
      },
      {
        title: "Eligibility Criteria",
        content:
          "Your business must meet three core requirements. First, it must be a small business according to SBA size standards. Second, your principal office — the location where the greatest number of employees perform their work — must be located in a HUBZone. The SBA maintains a HUBZone map on its website where you can check whether your address qualifies. HUBZones are designated based on unemployment rates, income levels, and other economic indicators, and the map is updated regularly. Third, at least 35% of your employees must reside in a HUBZone. This is verified during the application process and during annual recertification. Your business must also be at least 51% owned and controlled by U.S. citizens, and the owners must be of good character.",
      },
      {
        title: "How to Apply",
        content:
          "The application is submitted through Certify.SBA.gov, the same portal used for 8(a) and WOSB certifications. You will need to document your business size, ownership structure, the location of your principal office, and the residential addresses of all employees. The SBA will verify that your principal office address falls within a designated HUBZone using its mapping system. Employee residency is verified using the addresses on file with your payroll system. The review process typically takes 60-90 days. Once certified, you must recertify annually through the same portal and report any changes to your principal office location or employee residency within 30 days. If your principal office moves out of a HUBZone, you have a limited grace period to relocate back into a qualifying area or risk losing certification.",
      },
      {
        title: "Maintaining HUBZone Compliance",
        content:
          "Ongoing compliance is critical. You must maintain the 35% HUBZone resident employee requirement at all times. When hiring, prioritize candidates who live in HUBZone areas. Track employee addresses carefully and update your records if employees move. The SBA conducts periodic compliance reviews, and failure to maintain the 35% threshold can result in decertification. Your principal office must remain in a HUBZone — if you need to relocate, check the HUBZone map before signing a new lease. Also, be aware that HUBZone boundaries are updated periodically, and an area that qualified when you applied may no longer qualify, or a new area near you may become eligible. Monitor the SBA's HUBZone map for changes. If you lose certification, you can reapply if you meet the requirements again, but there is no guarantee of reinstatement.",
      },
    ],
  },
  {
    id: "rfp-reading-checklist",
    title: "RFP Reading & Analysis Checklist",
    description:
      "A systematic checklist for reviewing government RFPs — what to look for, common red flags, and how to determine if an opportunity is worth pursuing before you invest hours in a proposal.",
    icon: ClipboardList,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    badge: "Popular",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    category: "Bidding",
    readTime: "8 min",
    sections: [
      {
        title: "Step 1: Administrative & Deadline Review",
        content:
          "Before reading any technical content, check the administrative details first. Confirm the response deadline (including time zone), submission method (email, portal, physical mail), and whether there is a mandatory site visit or pre-bid conference. Check for any amendment history — RFPs are often modified after initial release, and you need all amendments to submit a compliant proposal. Look for the contracting officer's contact information and note any Q&A period or deadline for submitting questions. Verify that your SAM.gov registration, CAGE code, and any required certifications are current and will not expire before the contract award date. Missing a basic administrative requirement is the fastest way to get disqualified, no matter how strong your technical proposal is.",
      },
      {
        title: "Step 2: Eligibility & Set-Aside Verification",
        content:
          "Determine whether the solicitation is a full and open competition or a set-aside. Look for keywords like 'small business set-aside,' '8(a) sole source,' 'HUBZone,' 'SDVOSB,' or 'WOSB' in the title and solicitation sections. If it is a set-aside, verify that you hold the required certification. Check the NAICS code and size standard — confirm your business qualifies under the stated size standard for that NAICS. Be careful: some solicitations use multiple NAICS codes or have unusual size standards. If the solicitation is an 8(a) sole source, check whether it was communicated through the SBA's 8(a) Contracting Support system. For unrestricted solicitations, your certifications may still give you a competitive advantage through evaluation factors.",
      },
      {
        title: "Step 3: Scope of Work & Requirements Analysis",
        content:
          "Read the Statement of Work (SOW), Performance Work Statement (PWS), or Statement of Objectives (SOO) very carefully. Identify every deliverable, milestone, and performance metric. Highlight mandatory requirements (marked with 'shall' or 'must') versus desirable requirements (marked with 'should' or 'may' or 'preferred'). Create a compliance matrix mapping each requirement to the section of your proposal that addresses it. Pay special attention to security clearance requirements, travel requirements, staffing ratios, and any specific tools, technologies, or methodologies mandated. Look for vague or ambiguous requirements — these are red flags that indicate the agency may not have a clear picture of what they need, which can lead to scope creep during performance.",
      },
      {
        title: "Step 4: Evaluation Criteria & Scoring",
        content:
          "The evaluation section tells you exactly how your proposal will be scored. This is arguably the most important section to study. Identify the evaluation factors and their relative weights (e.g., Technical Approach 40%, Past Performance 30%, Cost/Price 30%). Structure your proposal to mirror these weights — spend the most space and effort on the highest-weighted factors. Look for any 'go/no-go' thresholds, where failing to meet a minimum score on a factor results in automatic disqualification. Check whether cost/price is evaluated using a lowest price technically acceptable (LPTA) methodology or best value tradeoff — this fundamentally changes your pricing strategy. Under LPTA, you only need to meet the minimum technical threshold, so the lowest price wins. Under best value, a higher price can be justified by a superior technical approach.",
      },
      {
        title: "Step 5: Go/No-Go Decision Framework",
        content:
          "After reviewing the RFP, use a structured go/no-go framework to decide whether to bid. Key factors to evaluate: Do you meet all mandatory eligibility requirements? Can you demonstrate relevant past performance? Do you have the team and capacity to deliver? Is the timeline realistic? Is the contract vehicle and type (firm fixed price, T&M, etc.) within your comfort zone? Can you price competitively? Is this a strategic opportunity that aligns with your business goals? Score each factor and set a threshold — if your total score falls below it, pass on the opportunity. Many small businesses make the mistake of bidding on everything, spreading their proposal team too thin and submitting weak proposals. A disciplined go/no-go process means bidding fewer opportunities but winning more often.",
      },
    ],
  },
  {
    id: "sam-gov-registration",
    title: "SAM.gov Registration Step-by-Step",
    description:
      "A practical walkthrough of registering your business on SAM.gov, obtaining a UEI number, activating your CAGE code, and keeping your registration current.",
    icon: Globe,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100",
    badge: "Essential",
    badgeColor: "bg-violet-100 text-violet-800 border-violet-300",
    category: "Registration",
    readTime: "7 min",
    externalLink: "https://sam.gov",
    sections: [
      {
        title: "Why SAM.gov Registration is Mandatory",
        content:
          "SAM.gov (System for Award Management) is the official U.S. government registry for entities doing business with the federal government. You cannot be awarded a federal contract, grant, or cooperative agreement without an active SAM.gov registration. It is also required to receive payments from federal agencies. Your registration includes your Entity ID (formerly known as a DUNS number, now replaced by the Unique Entity ID assigned by SAM.gov), your CAGE code, and business information such as your NAICS codes, capabilities, and socio-economic status. Federal contracting officers use SAM.gov to verify that offerors are eligible and registered before evaluating proposals. An expired or inactive registration at the time of award will result in the contract being withheld until you renew.",
      },
      {
        title: "Step 1: Obtain a Unique Entity ID (UEI)",
        content:
          "As of April 2022, the federal government transitioned from DUNS numbers to Unique Entity IDs (UEIs) assigned directly through SAM.gov. To get started, go to SAM.gov and create an account. You will need to verify your identity using a government-issued ID through SAM.gov's login.gov integration. Once logged in, you can initiate a new entity registration. The system will check whether your business already has a UEI — many businesses received one automatically during the DUNS-to-UEI transition. If not, a new UEI is generated as part of the registration process. You do not need to go through Dun & Bradstreet anymore. Have your business formation documents (articles of incorporation, operating agreement), EIN from the IRS, and bank account information ready before starting.",
      },
      {
        title: "Step 2: Complete Your Registration",
        content:
          "Fill out all required sections of the registration form. This includes your legal business name and any doing-business-as (DBA) names, physical address and mailing address, business type (sole proprietorship, LLC, corporation, etc.), point of contact information, and banking details for electronic funds transfer (EFT) payments. You will also select your primary and secondary NAICS codes — choose codes that accurately reflect what your business does, as these determine which set-aside and size standard requirements apply. Designate your socio-economic status (small business, 8(a), HUBZone, SDVOSB, WOSB, etc.) based on your current certifications. Finally, you must complete the annual representations and certifications, including certifications about your business size, ownership, and any criminal or civil legal proceedings.",
      },
      {
        title: "Step 3: CAGE Code Activation",
        content:
          "Your CAGE (Commercial and Government Entity) code is assigned automatically as part of the SAM.gov registration process. Previously managed by the Defense Logistics Agency (DLA), CAGE codes are now integrated into SAM.gov. Your CAGE code is a five-character identifier that uniquely identifies your business to federal agencies and is used in contract awards, purchase orders, and payment processing. After submitting your registration, the CAGE code activation process begins, which includes validation of your business information. This typically takes 7-10 business days. You can check the status of your registration in your SAM.gov account. Once active, your registration is valid for one year and must be renewed annually. Set a calendar reminder 60 days before expiration to avoid a lapse.",
      },
      {
        title: "Common Issues & Troubleshooting",
        content:
          "The most frequent registration issue is a mismatch between the legal business name on SAM.gov and the name on file with the IRS or your state formation documents. Ensure exact consistency across all documents. Another common problem is failing to complete the EFT information correctly — the bank routing number and account number must match exactly, or you will not receive payments. If your registration is 'In Progress' for more than 10 business days, check your SAM.gov dashboard for any validation errors or requests for additional information. If your entity was previously registered under a DUNS number and you cannot find your UEI, use the 'Entity Search' function on SAM.gov to look up your business. If you encounter technical issues, contact the SAM.gov Federal Service Desk at 1-866-606-8220 or through their online portal.",
      },
    ],
  },
  {
    id: "far-compliance-basics",
    title: "FAR Compliance Basics for Contractors",
    description:
      "An introduction to the Federal Acquisition Regulation (FAR) — the key clauses you will encounter, what they mean, and how to stay compliant during contract performance.",
    icon: Scale,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
    badge: "Important",
    badgeColor: "bg-red-100 text-red-800 border-red-300",
    category: "Compliance",
    readTime: "11 min",
    sections: [
      {
        title: "What is the FAR?",
        content:
          "The Federal Acquisition Regulation (FAR) is the primary regulation governing the federal government's acquisition of goods and services. It is issued under the authority of the Office of Federal Procurement Policy (OFPP) and is maintained jointly by the Department of Defense (DoD), the General Services Administration (GSA), and the National Aeronautics and Space Administration (NASA). The FAR consists of 53 parts organized into subchapters covering everything from competition requirements to contract types, socio-economic programs, contract administration, and contract clauses. Every federal contract includes FAR clauses — standardized provisions that define the legal rights and obligations of both parties. Understanding which FAR clauses apply to your contract and what they require is essential for compliance and avoiding costly violations.",
      },
      {
        title: "Critical FAR Clauses Every Contractor Should Know",
        content:
          "Several FAR clauses appear in nearly every contract and deserve special attention. FAR 52.212-4 (Contract Terms and Conditions — Commercial Items) covers payment terms, inspections, and warranties. FAR 52.219-14 (Limitations on Subcontracting) limits the amount of work a prime contractor can subcontract to other firms on small business set-aside contracts — you must perform at least 50% of the cost of the contract (or a higher percentage for certain services) with your own employees. FAR 52.222-50 (Combating Trafficking in Persons) prohibits trafficking-related activities by your employees and subcontractors. FAR 52.203-13 (Contractor Code of Business Ethics and Conduct) requires you to have a code of business ethics and a compliance program. FAR 52.204-13 (System for Award Management) requires you to maintain an active SAM.gov registration throughout the contract period.",
      },
      {
        title: "Flow-Down Requirements",
        content:
          "Many FAR clauses must be 'flowed down' — meaning you must include them in your subcontracts and purchase orders. The most important flow-down clause is FAR 52.244-6 (Subcontracts for Commercial Items), which lists the clauses that must be included in commercial subcontracts. For example, if your prime contract includes FAR 52.219-14 (Limitations on Subcontracting), you need to ensure your own subcontracting approach complies and does not cause you to fall below the required performance percentage. Similarly, equal employment opportunity clauses (FAR 22), cybersecurity requirements (FAR 39 and DFARS 252.204-7012), and prohibited personnel practices must all flow down. Failing to include required flow-down clauses in your subcontracts is a compliance violation that can lead to default or termination.",
      },
      {
        title: "Audit & Record Keeping",
        content:
          "FAR Part 4 (Administrative Matters) and FAR Subpart 4.7 (Contractor Records Retention) require you to maintain complete and accurate records related to your contract. For contracts subject to the Cost Accounting Standards (CAS) or requiring a DCAA audit, you need a compliant accounting system that can segregate direct and indirect costs by contract. Keep all invoices, timesheets, receipts, correspondence, and project documents organized and accessible. The standard retention period is 3 years after final payment, but some records (like those related to claims or disputes) must be kept longer. If your contract is with the DoD, be aware of DFARS-specific requirements that add additional obligations on top of FAR requirements. A proactive approach to record-keeping — using project management and accounting software designed for government contracting — will save significant time and stress during audits.",
      },
    ],
  },
  {
    id: "sdvosb-wosb-guide",
    title: "SDVOSB & WOSB Certification Guide",
    description:
      "How to obtain Service-Disabled Veteran-Owned and Women-Owned Small Business certifications — eligibility, application steps, and how they unlock set-aside contracts.",
    icon: Users,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-100",
    badge: "Certification",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    category: "Certification",
    readTime: "9 min",
    sections: [
      {
        title: "SDVOSB Program Overview",
        content:
          "The Service-Disabled Veteran-Owned Small Business (SDVOSB) program provides contracting preferences to small businesses that are at least 51% owned and controlled by one or more service-disabled veterans. A service-disabled veteran is a veteran with a disability rating issued by the Department of Veterans Affairs (VA) or the Department of Defense (DoD). The program allows federal agencies to set aside contracts specifically for SDVOSB firms and provides a price evaluation preference in full and open competitions. In fiscal year 2023, the federal government awarded over $30 billion to SDVOSB firms, making this one of the most lucrative set-aside programs available. The VA has its own SDVOSB verification program for VA contracts (the Vets First Verification Program), while other agencies rely on self-certification through SAM.gov.",
      },
      {
        title: "WOSB Program Overview",
        content:
          "The Women-Owned Small Business (WOSB) and Economically Disadvantaged Women-Owned Small Business (EDWOSB) programs provide set-aside and sole-source contracting opportunities to small businesses that are at least 51% owned and controlled by women. The WOSB program covers 83 NAICS codes in industries where women are historically underrepresented. The EDWOSB program is available across all industries for women who meet additional economic disadvantage criteria (similar to the 8(a) program's economic disadvantage test, with a $750,000 net worth threshold and $400,000 income threshold). Certification is now required through the SBA's Certify.SBA.gov portal — self-certification through SAM.gov is no longer sufficient for new applicants. The SBA conducts a thorough review of ownership, control, and financial documents before granting certification.",
      },
      {
        title: "Application Steps for Both Programs",
        content:
          "Both SDVOSB (non-VA) and WOSB certifications are now applied for through Certify.SBA.gov. The process involves creating an account, completing the application with detailed ownership, control, and financial information, and uploading supporting documents. For SDVOSB, you need your VA disability rating letter (or DoD equivalent) as proof of service-connected disability. For WOSB, you need documentation showing that women own at least 51% of the business and control day-to-day operations and long-term decision-making. For EDWOSB, additional financial documentation is required. The SBA review process typically takes 60-90 days. For VA-specific SDVOSB verification (required for VA contracts), apply through the VA's Vets First Verification Program at va.gov. The VA verification process has additional requirements including a good character check and a review of the firm's capabilities.",
      },
      {
        title: "Ownership & Control Requirements",
        content:
          "The most common reason for denial in both programs is failure to demonstrate that the designated owner (service-disabled veteran or woman) truly controls the business. Control means the owner makes the day-to-day management decisions, holds the highest officer position (CEO, President, etc.), and has the power to hire and fire. The owner must work full-time in the business during normal working hours — it cannot be a passive or part-time role. A non-qualifying spouse, family member, or investor who holds significant decision-making power can jeopardize your certification. For SDVOSB, the service-disabled veteran must manage the business on a full-time basis and cannot be employed by another firm during normal business hours. The SBA will examine corporate bylaws, operating agreements, stock certificates, and board meeting minutes to verify control.",
      },
    ],
  },
  {
    id: "contract-types-explained",
    title: "Federal Contract Types Explained",
    description:
      "Understanding the difference between Firm Fixed Price, Cost-Plus, T&M, IDIQ, and other contract types — and how each impacts your risk and pricing strategy.",
    icon: FileCheck,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
    badge: "Knowledge",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
    category: "Contracts",
    readTime: "8 min",
    sections: [
      {
        title: "Firm Fixed Price (FFP)",
        content:
          "Under a Firm Fixed Price contract, you agree to deliver the specified work for a set price. If the work costs more than expected, you absorb the overrun. If it costs less, you keep the savings. FFP contracts place maximum risk on the contractor but also offer maximum profit potential. They are the government's preferred contract type because costs are predictable. When pricing an FFP, build in adequate contingency — a common mistake is underpricing to win the bid and then losing money on performance. Analyze every requirement carefully and include a risk buffer of 10-20% depending on complexity. FFP is most suitable when the scope of work is well-defined, the requirements are stable, and you have experience performing similar work. If the requirements are vague or likely to change, FFP can be dangerous.",
      },
      {
        title: "Cost-Plus-Fixed-Fee (CPFF)",
        content:
          "Under a Cost-Plus contract, the government reimburses your allowable, allocable, and reasonable costs plus a negotiated fixed fee as profit. The fee does not change regardless of your actual costs. This type shifts most risk to the government and is typically used when the scope is uncertain or when the work involves research and development, first-of-a-kind efforts, or services where costs cannot be accurately estimated. The government will audit your costs, so you need a compliant accounting system that tracks costs by contract. CPFF contracts are common in DoD and NASA work. While they reduce pricing risk, they also cap your profit at the negotiated fee — you cannot earn more even if you perform efficiently. Your fee is typically 7-10% of the estimated cost for most contracts.",
      },
      {
        title: "Time & Materials (T&M)",
        content:
          "A T&M contract pays for labor at fixed hourly rates and reimburses materials at cost (or at fixed rates). It is essentially an open-ended arrangement where the total price depends on how many hours and materials are required. T&M contracts are supposed to be used only when it is not possible to estimate the scope accurately at the outset, and they typically include a ceiling price that the contractor cannot exceed without prior approval. From a risk perspective, T&M is somewhere between FFP and Cost-Plus — you have some certainty about your labor rates but the total hours are not guaranteed. Be cautious with T&M contracts: if the client is disorganized or scope creep is likely, you can hit the ceiling quickly and have to negotiate an increase. Always try to negotiate a well-defined ceiling with some buffer.",
      },
      {
        title: "IDIQ & Task Order Contracts",
        content:
          "An IDIQ (Indefinite Delivery/Indefinite Quantity) contract establishes a framework agreement with a government agency. It specifies the general terms, pricing, and ceiling amount, but does not guarantee any specific work. Individual orders are placed through task orders or delivery orders as needs arise. IDIQs are extremely common in federal contracting — major vehicles like GSA Schedules, CIO-SP3, OASIS, and SEWP are all IDIQ vehicles. Getting on an IDIQ is valuable because it positions you to compete for task orders without going through a full competition each time. However, getting onto the vehicle itself is highly competitive. Once on the IDIQ, you still compete against other awardees for individual task orders, though the competitive pool is much smaller than a full and open competition. Budget time and resources for both winning the IDIQ and competing for task orders.",
      },
    ],
  },
  {
    id: "small-business-setasides",
    title: "Understanding Small Business Set-Asides",
    description:
      "How set-aside contracts work, the different types of set-asides, thresholds, and how to maximize your advantage as a certified small business.",
    icon: Building2,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100",
    badge: "Knowledge",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    category: "Contracts",
    readTime: "6 min",
    sections: [
      {
        title: "What Are Set-Aside Contracts?",
        content:
          "A set-aside is a contract that is reserved exclusively for small businesses or specific categories of small businesses. The federal government has a statutory goal of awarding at least 23% of all federal contract dollars to small businesses. To achieve this, contracting officers are required to set aside contracts for small business competition when there is a reasonable expectation that at least two or more responsible small businesses will submit offers and the award can be made at fair market prices. Set-asides dramatically reduce the competitive field — instead of competing against large defense contractors, you compete only against other small businesses, leveling the playing field significantly. Understanding how set-asides work and which ones you qualify for is one of the most important strategic advantages a small business can have.",
      },
      {
        title: "Types of Set-Asides",
        content:
          "There are several levels of set-aside contracts. A total small business set-aside is open to any business that meets the size standard for the contract's NAICS code. A partial set-aside reserves a portion of the contract for small businesses while the remainder is open to all. Beyond general small business set-asides, there are program-specific set-asides: 8(a) sole source and competitive set-asides, HUBZone set-asides, SDVOSB set-asides, and WOSB/EDWOSB set-asides. Each requires the corresponding certification. A single contract may have multiple set-aside designations — for example, an 8(a) sole source that is also a HUBZone set-aside. In cases of multiple eligibility, the agency determines the most appropriate set-aside type based on their acquisition strategy and the available pool of qualified firms.",
      },
      {
        title: "Sole Source Thresholds",
        content:
          "Certain set-aside programs allow agencies to award contracts without competition (sole source) up to specific dollar thresholds. For 8(a) firms, the sole-source threshold is $4.5 million for goods and services and $7 million for manufacturing. For HUBZone firms, the threshold is $4.5 million. For WOSB and SDVOSB, the threshold is also $4.5 million (or $7 million for manufacturing under certain circumstances). These thresholds are adjusted periodically for inflation. A sole-source award means the agency selects your firm directly without a competitive process — no proposals to write, no competition to beat. This is one of the most powerful benefits of these certifications. However, agencies must justify the sole source by demonstrating that only one responsible firm can meet the requirement, so it is not guaranteed.",
      },
    ],
  },
  {
    id: "proposal-writing-tips",
    title: "Federal Proposal Writing Best Practices",
    description:
      "Practical tips for writing winning federal proposals — structure, tone, compliance, and how to stand out in competitive evaluations.",
    icon: BookOpen,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-100",
    badge: "Popular",
    badgeColor: "bg-pink-100 text-pink-800 border-pink-300",
    category: "Bidding",
    readTime: "10 min",
    sections: [
      {
        title: "Understanding the Evaluation Process",
        content:
          "Before writing a single word, understand how your proposal will be evaluated. The evaluation criteria and their weights are specified in Section M of the RFP (or Section L for instructions). Your proposal structure must mirror the evaluation factors — if the agency evaluates Technical Approach (40%), Past Performance (30%), and Cost (30%), then approximately 40% of your proposal volume should address the technical approach. Use the exact terminology from the RFP in your headings and subheadings to make it easy for evaluators to find relevant information. Federal evaluators typically have limited time to review each proposal — sometimes as little as 30-60 minutes. A well-organized, easy-to-navigate proposal that directly addresses each evaluation factor has a significant advantage over a dense, disorganized one, even if the content is comparable.",
      },
      {
        title: "Structuring Your Proposal",
        content:
          "Every proposal should follow a consistent structure: an executive summary or cover letter, a compliance matrix, the technical volume, the past performance volume, the cost/price volume, and required administrative forms and certifications. Start with a compliance matrix that maps every requirement in the RFP to the specific page and paragraph in your proposal where you address it. This ensures nothing is missed and helps evaluators verify compliance. In the technical volume, use a clear hierarchy: sections that mirror the RFP's sections, subsections for each major requirement, and paragraphs that directly respond to what the agency asked for. Use graphics, tables, and charts where they add clarity — but only if they are relevant and well-executed. Poorly formatted graphics are worse than none at all.",
      },
      {
        title: "Writing Style & Tone",
        content:
          "Federal proposal writing is different from commercial writing. Use clear, direct, and professional language. Avoid jargon unless it is standard government/industry terminology from the RFP. Be specific — instead of saying 'we have extensive experience,' say 'we successfully completed five similar projects for federal agencies totaling $12M over the past three years.' Quantify everything. Use active voice and present tense: 'We will implement a risk-based approach using NIST 800-53 controls' is stronger than 'A risk-based approach would be implemented.' Avoid superlatives and unsubstantiated claims — evaluators are trained to spot marketing language and it undermines credibility. Focus on the government's needs, not your company's capabilities. Frame every capability in terms of how it benefits the agency and solves their specific problem as described in the RFP.",
      },
      {
        title: "Common Proposal Mistakes",
        content:
          "The most common proposal mistakes are also the most costly. Failing to follow the RFP's formatting instructions (page limits, font size, margin requirements) can result in disqualification. Not addressing every evaluation factor, especially lower-weighted ones, loses points unnecessarily. Submitting boilerplate past performance that does not directly relate to the current RFP's requirements is another frequent error — evaluators want to see relevance, not a list of every contract you have ever won. Weak pricing — either too high without justification or unrealistically low — can undermine an otherwise strong technical proposal. Finally, rushing the review process and submitting a proposal with typos, inconsistencies, or cross-references that do not match signals a lack of attention to detail that evaluators assume will carry over into contract performance. Always have someone who did not write the proposal review it before submission.",
      },
    ],
  },
  {
    id: "dcaa-audit-prep",
    title: "DCAA Audit Preparation Guide",
    description:
      "What to expect from a Defense Contract Audit Agency audit, how to prepare your accounting system, and the most common findings that lead to questioned costs.",
    icon: FileCheck,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-100",
    badge: "Advanced",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
    category: "Compliance",
    readTime: "9 min",
    sections: [
      {
        title: "When Will You Face a DCAA Audit?",
        content:
          "The Defense Contract Audit Agency (DCAA) audits are most commonly triggered by cost-reimbursement and T&M contracts with the Department of Defense, but DCAA may also audit contracts with other agencies if requested. You can expect an audit during initial contract award (to verify your accounting system is adequate), when you submit an incurred cost proposal at the end of each contract year, when you request a rate change, during a pre-award survey for a new contract, or as part of a specific audit request related to billing discrepancies. Even if you primarily work on FFP contracts, if you have any cost-type contracts in your portfolio, you should be prepared for a DCAA audit. The scope can range from a focused review of specific costs to a comprehensive evaluation of your entire accounting system.",
      },
      {
        title: "Accounting System Requirements",
        content:
          "DCAA expects your accounting system to meet 18 specific criteria outlined in the DCAA Audit Manual. The key requirements include: proper segregation of direct costs from indirect costs, a timekeeping system that accurately records labor hours by project and function, an adequate job cost accounting system, a system for identifying and accumulating allowable costs by contract, proper treatment of unallowable costs, and a mechanism for timely cost allocation. Your system should be able to produce reliable data that is supported by source documentation. Many small businesses use commercial accounting software like QuickBooks, but it must be properly configured for government contracting — the default setup is rarely sufficient. Consider working with a government contracting accountant to set up your chart of accounts, cost pools, and allocation bases correctly from the start.",
      },
      {
        title: "Timekeeping Best Practices",
        content:
          "Labor is typically the largest cost element in government contracts and the most scrutinized during audits. Implement a timekeeping system where each employee records their actual hours worked each day, charged to the specific project or indirect account they worked on. Daily recording is critical — DCAA considers weekly or biweekly recollection unreliable. Employees should not have the ability to alter timecards after they are submitted and approved. Supervisors must review and approve timecards within a reasonable period (typically one work week). Cross-train employees who work on multiple contracts and ensure their time is accurately distributed. The most common audit finding related to timekeeping is 'estimating' hours rather than recording actual time — this is a serious compliance issue that can result in questioned costs.",
      },
    ],
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All",
  "Certification",
  "Registration",
  "Bidding",
  "Compliance",
  "Contracts",
] as const;

const SORT_OPTIONS = [
  "Relevance",
  "Read Time",
  "Title A-Z",
] as const;

// ─── Guide Card Component ───────────────────────────────────────────────────

function GuideCard({ guide }: { guide: ResourceGuide }) {
  const Icon = guide.icon;

  return (
    <Card className="overflow-hidden border border-br-border bg-br-surface transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${guide.iconBg}`}
              >
                <Icon className={`size-5 ${guide.iconColor}`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={`text-[10px] px-2 py-0.5 border ${guide.badgeColor}`}
                  >
                    {guide.badge}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-br-text-secondary border-br-border"
                  >
                    {guide.category}
                  </Badge>
                </div>
                <h3 className="font-heading mt-2 text-base font-semibold text-br-dark leading-snug">
                  {guide.title}
                </h3>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-br-text-secondary line-clamp-3">
            {guide.description}
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs text-br-text-secondary">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {guide.readTime} read
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3.5" />
              {guide.sections.length} sections
            </span>
          </div>
        </div>

        {/* Expandable Content */}
        <div className="border-t border-br-border">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="content" className="border-0">
              <AccordionTrigger className="px-6 py-3 text-xs font-medium text-br-primary hover:no-underline hover:bg-br-light/50 transition-colors rounded-none">
                <span className="flex items-center gap-1.5">
                  <ChevronDown className="size-3.5" />
                  Read this guide
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  {guide.sections.map((section, idx) => (
                    <div key={idx} className="pl-2">
                      <h4 className="font-heading text-sm font-semibold text-br-dark mb-1.5">
                        {section.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-br-text-secondary">
                        {section.content}
                      </p>
                      {idx < guide.sections.length - 1 && (
                        <hr className="mt-4 border-br-border" />
                      )}
                    </div>
                  ))}
                </div>

                {guide.externalLink && (
                  <div className="mt-5 pt-4 border-t border-br-border">
                    <a
                      href={guide.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-br-primary hover:text-br-secondary transition-colors"
                    >
                      Official source
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sidebar Component ───────────────────────────────────────────────────────

function ResourceSidebar() {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-20 space-y-5">
        {/* CTA Card */}
        <Card className="border border-br-accent/30 bg-gradient-to-br from-br-light to-white">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-br-accent/10">
              <Star className="size-7 text-br-accent" />
            </div>
            <h3 className="font-heading text-sm font-semibold text-br-primary">
              Try AI-Powered RFP Analysis
            </h3>
            <p className="text-xs text-br-text-secondary leading-relaxed">
              Upload any government RFP and get instant compliance checks, risk
              scoring, and actionable recommendations in minutes.
            </p>
            <a href="/analyzer">
              <Button
                size="sm"
                className="bg-br-accent text-br-dark hover:bg-br-accent/90 font-semibold text-sm"
              >
                Try RFP Analyzer
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Tip Card */}
        <Card className="border border-br-border">
          <CardContent className="p-5">
            <h4 className="font-heading text-xs font-semibold text-br-dark uppercase tracking-wider mb-2">
              Pro Tip
            </h4>
            <p className="text-xs leading-relaxed text-br-text-secondary">
              Use BidRank&apos;s RFP Analyzer alongside these guides for a
              comprehensive approach. Upload your RFP, get an AI analysis, then
              reference the relevant guide to deepen your understanding of
              specific requirements.
            </p>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ConsultantsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Relevance");

  const filteredGuides = useMemo(() => {
    let results = resourceGuides.filter((g) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.sections.some(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              s.content.toLowerCase().includes(q)
          );
        if (!matches) return false;
      }

      // Category
      if (categoryFilter !== "All") {
        if (g.category !== categoryFilter) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "Read Time") {
      results.sort((a, b) => {
        const aMin = parseInt(a.readTime);
        const bMin = parseInt(b.readTime);
        return aMin - bMin;
      });
    } else if (sortBy === "Title A-Z") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    return results;
  }, [search, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <section className="bg-br-primary px-4 py-10 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-heading text-3xl font-bold text-white">
            Federal Contracting Resource Library
          </h1>
          <p className="mt-2 text-br-text-secondary max-w-2xl">
            Comprehensive guides, checklists, and references to help you
            navigate federal contracting — from registration to proposal
            writing to compliance.
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-30 bg-br-surface border-b border-br-border shadow-br-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-br-text-secondary" />
              <Input
                placeholder="Search guides..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 text-sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? "bg-br-primary text-white"
                      : "bg-br-light text-br-dark hover:bg-br-light"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-md border border-br-border bg-br-surface px-3 text-xs text-br-dark focus:outline-none focus:ring-2 focus:ring-br-primary/20"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 lg:px-12">
        <div className="flex gap-8">
          {/* Grid */}
          <div className="flex-1 min-w-0">
            {/* Results Count */}
            <p className="mb-4 text-sm text-br-text-secondary">
              {filteredGuides.length} guide
              {filteredGuides.length !== 1 ? "s" : ""} found
              {search && (
                <span>
                  {" "}
                  for &ldquo;
                  <span className="font-medium text-br-dark">{search}</span>
                  &rdquo;
                </span>
              )}
            </p>

            {filteredGuides.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="mb-3 size-10 text-br-text-secondary/40" />
                  <h3 className="font-heading text-sm font-semibold text-br-dark">
                    No guides found
                  </h3>
                  <p className="mt-1 text-xs text-br-text-secondary max-w-sm">
                    Try adjusting your search terms or category filter.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 text-xs"
                    onClick={() => {
                      setSearch("");
                      setCategoryFilter("All");
                      setSortBy("Relevance");
                    }}
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {filteredGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <ResourceSidebar />
        </div>
      </main>

      {/* Disclaimer */}
      <footer className="mt-auto border-t bg-br-light px-4 py-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-[11px] leading-relaxed text-br-text-secondary">
            BidRank.pro provides software tools and curated informational
            guides. These guides are for educational purposes only and do not
            constitute legal, tax, or professional advice. Always consult with
            a qualified professional for your specific situation.
          </p>
        </div>
      </footer>
    </div>
  );
}