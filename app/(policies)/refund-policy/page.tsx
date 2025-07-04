import Image from "next/image";
import Link from "next/link";
import policyBG from "@/public/image/policyBG.webp";

export default function RefundPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Image
        src={policyBG}
        alt="Background"
        fill
        priority
        placeholder="blur"
        className="object-cover z-0"
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="p-7 rounded-xl text-white max-w-7xl w-full h-[80%] flex flex-col">
          <h1 className="text-3xl font-bold mb-4 text-center">Refund Policy</h1>

          <div
            className="overflow-y-auto flex-1 pr-4 rounded-md"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#6b7280 #1f2937", // zinc-500 and zinc-900
            }}
          >
            <p className="text-sm leading-relaxed tracking-wide pr-2">
              Basic Definitions This Terms of Use Agreement ("Agreement") sets
              forth the legally binding terms for your use of the Cognizance
              Services. You are only authorized to use the Cognizance Services
              (regardless of whether your access or use is intended) if you
              agree to abide by all applicable laws and to this Agreement.
              Please read this Agreement carefully before using this website. By
              registering on, accessing, browsing, downloading or using the
              Cognizance site for any general purpose or for the specific
              purpose of availing any Service, you agree, automatically and
              immediately to be bound by this Agreement as well as by any the
              service specific terms and conditions applicable to each Service,
              whether you are a "Visitor" (which means that you simply browse
              the Cognizance site) or you are a "Member" (which means that you
              have registered with Cognizance). The term "User" refers to a
              Visitor or a Member. Subject to your compliance with this
              Agreement, you may print these terms of use or save a copy of
              these terms of service for your own personal and non-commercial
              use. If you do not agree with any of these terms, you may not
              access, browse or use the Cognizance site and immediately
              terminate your availing of the The term 'authorized user' would
              include any person, whether an individual or a legal entity who
              has subscribed to the services of Cognizance, and to whom the
              access is restricted by the use of a sign in user name and a
              password. The user name and password are either allotted by
              Cognizance or chosen by the user or agreed upon by Cognizance.
              Therefore only the authorized user has the right to access the
              services offered by Cognizance. Cognizance will not be responsible
              for any costs, consequences or damages caused to any persons or
              entities due to any unauthorized use of the services offered by
              Cognizance, including access of the said services by an
              unauthorized user using the user name and password of an
              authorized user, regardless of whether such unauthorized user is
              known to the authorized user. The terms 'service' or 'services'
              would mean to include the interactive online solutions and
              information services offered by Cognizance on the internet/mobile
              through which the user may access information carried by
              Cognizance in the database maintained by it. You agree not to
              copy, sell, resell, duplicate any part of Cognizance's services
              and solutions for commercial purposes. These Terms of Service sets
              out the legally binding terms of your use of Cognizance and your
              membership in Cognizance and may be modified by Cognizance at any
              time and without prior notice, such modifications to be effective
              upon posting by Cognizance on the website. Your continued access
              or use of the Site and/or the Services after the Terms of Services
              have been revised constitutes your express consent to the modified
              Terms of Services. In the event of any inconsistency between our
              Privacy Policy and these Terms of Service, the Terms of Service
              shall prevail. If you do not agree to be bound by the terms of
              this Agreement, you may not use nor access our services.
              Eligibility Cognizance services are available to all individuals
              who have at least completed high school. Individuals who are
              currently in high school or below may access and use the site,
              they shall do so only with the involvement and guidance of their
              parents and or legal guardians. In all such instances their
              parents and or legal guardians will be held responsible for all
              the terms of this agreement. By registering with Cognizance you
              consent to the use of: (i) electronic means to complete the Terms
              and to provide you with any notices given pursuant to the Terms;
              and (ii) electronic records to store information related to the
              Terms or your use of the Services. Cognizance has the right, in
              its sole discretion, to suspend or terminate your use of
              Cognizance services and refuse any and all current or future use
              of all or any portion of Cognizance's services. Registration of a
              candidate is only considered if and only if the candidate is
              enrolled in at least one or more events or workshops Service
              Cognizance provides self-managed event organizing solutions to
              event organizers. Event organizers setup their event, fill up the
              details about their event such as event pricing, location, ticket
              inventory, attendee registration information collection and other
              such features. As used herein, "Customers" means Cognizance event
              organizers ("Event Organizer "), registered event attendees
              ("Attendee ") and participants in our various affiliate programs.
              Event Organizer Terms Cognizance offers organizers a web-based
              solution to organize events and meetings, to sell tickets or
              provide online Attendee Registration solutions via the
              Cognizance-Websites for events of the organizer to customers by
              using Cognizance to take on the payment process. In detail
              Cognizance provides the following services to the organizer (each
              an "Cognizance-Service"): A web-based software on the
              Cognizance-websites to organize events and to sell tickets of the
              organizer for these events to ticket buyers. The organizer has the
              possibility to create an own website for their event ("eventsite")
              and to offer a ticket sale. The ticket buyer can choose and buy
              the tickets on the eventsite directly. Only the user and the
              organizer of an event are entering into an agreement regarding the
              event and the disposal of tickets for that event. Cognizance only
              acts as a sales agent for the organizer of an event by order and
              for account of this organizer. It is the organizers' duty to
              advise and instruct the ticket buyers of their eventually existing
              right of objection according to the legal guidelines. The
              organizer authorises Cognizance hereby for the duration of this
              agreement to act as an agent by order and for account of the
              organizer, to sell tickets to the public for events, offered by
              the organizer on the Cognizance-Websites, to undertake the payment
              process with the ticket buyers and/or their banks and to ship the
              tickets to the ticket buyers. By providing Cognizance with such
              authorization, organizer also agrees to the Stripe Connected
              Account Agreement . This authorization also contains the right of
              Cognizance to send payment reminders to the ticket buyers.
              Attending Events Cognizance is not legally responsible or liable
              for Cancellation/postponement of events done by the Organizers.
              Any damage or injury of any sorts caused by attending events. If
              the event organizer denies entry from the venue. If the event
              organizer does not implement claimed covid-19
              guidelines/protocols. The accomodation is officially assigned from
              10am to 10 pm. The organizers are not responsible for non
              allotment of the room. Shipment and Delivery The organizer can
              choose, whether the tickets shall be deposited on the venue or
              shall be sent electronically or if the ticket buyer shall have the
              choice between these different shipment methods. As far as tickets
              shall be deposited on the venue the organizer has the right to
              choose, whether the tickets shall be paid on the venue and/or in
              advance via Cognizance. At the option of the organizer, Cognizance
              can also offer offline ticketing i.e. Cognizance will take all
              tickets from the Organiser, offer a set number of the tickets
              online as suggested by the organizer, or as deemed suitable by
              Cognizance, and put the remaining tickets into its retail
              associate networks (such as any cafÃ? ©s, bistros etc. with which
              Cognizance may tie up). The Event organizer shall decide upon
              whether it wants to avail of only online/electronic ticketing
              solutions provided by Cognizance or whether it prefers Cognizance
              to provide both paper version and electronic version ticketing
              services. Payment and Fees Cognizance products and services are
              available on the basis of transaction model, as per the
              requirements of customers. Cognizance will be responsible only for
              the taxes applicable on Cognizance Fees (including TS fee, PG fee
              and fixed ticket charge). Organizer will bear the full
              responsibility of the taxes applicable on ticket price and
              Cognizance can not be held accountable for any inaccurate
              information provided by organizer for such taxes. The collected
              security money will be reimbursed on day 3 between 12 midnight and
              2 am. After which the organizer will decide another session for
              reimbursement after all the delegations are finished which might
              take 2-3 days. The only viable tickets generated for the fest is
              the one supported through the eazebuzz payment links provided by
              the Cognizance Team. NOTE: It is compulsory to buy ticket before
              buying workshop. Without ticket you are not allowed to enter any
              workshop or events Change of an event If an event for which
              tickets are sold or already have been sold via Cognizance shall be
              cancelled or changed (regarding date, time, venue or other
              important points) the organizer has to inform Cognizance
              immediately in writing once these circumstances have come to his
              attention. Prize Money Distribution Prize Money Distribution The
              prize money distribution would be conveyed to the ticket buyers
              via the events page on the Cognizance website. The prize money to
              be distributed would be subject to the number of teams
              participating in the respective event. Five or fewer teams – prize
              would be given only to the first place holding team. Nine or fewer
              teams - prize would be given only to the first and second place
              holding team. More than nine teams – prize would be given to
              first, second and third place holding teams. *indicates that the
              prize amount mentioned contains coupons, vouchers, courses, and
              gift hampers equal to the worth of amount mentioned on the
              website. *A team will be eligible for prizes, if all of their team
              members are UG(Undergraduate) students studying in their
              respective institutes. Accounting The organizer has options of
              various payment method(s) (credit card, direct debiting,
              prepayment, invoice) to be offered to possible ticket buyers. In
              accordance to this choice Cognizance undertakes accounting for the
              organizer and holds the money on a separate bank account. The
              organizer authorises Cognizance to do so. Cognizance transfers the
              money received according to service pricing minus the fees payable
              to Cognizance within 5 to 7 business days post the event to the
              organizer. The money has to be transferred to a bank account
              located in the country where the event took place and issued on
              the name of the organizer. For recurring events, Cognizance
              reserves the right to pay out money before the event. Cognizance
              reserves the right to change the number of days to transfer money
              to the event organizer at any time without notice. The organizer
              is aware of the risk that specific payment methods (direct
              debiting or credit card) can be reversed by the ticket buyers. The
              organizer bears this risk alone. If transactions are reversed
              after the payment to the organizer, these costs plus a fee for the
              reversed transaction as stated in the price list published on the
              Cognizance-Websites are charged to the organizer. The organizer is
              obliged to raise objections, if any, against the accounts of
              Cognizance within four weeks after issue of the account. If not
              the account is considered as being approved. Prevention against
              fraud / misusage The Cognizance-Websites offer an extensive
              security system, in particular to protect organizers against
              reimbursement of credit card payments. Because of this security
              system it is possible that in exceptional cases some credit card
              providers may not be accepted. If the organizer arouses suspicion
              of misusage of the Cognizance-Websites, Cognizance has the right
              to deactivate the ticket shop of the organizer and to stop the
              ticket selling. In particular a suspicion of misusage of the
              Cognizance-Websites is on hand, if it comes to attention before
              the event that the event shall not (or not in the way as stated in
              the ticket shop) take place; or illegal or immoral events shall
              take place; or If the organizer arouses suspicion of misusage of
              the Cognizance-Websites, Cognizance has the right to delay the
              payout to the organizer even after 5 to 7 business days for
              further 60 days. Within these 60 days Cognizance will check if an
              improper use of the Cognizance-Websites and / or
              Cognizance-Services occurred. Cognizance also reserves the right
              to block any event from its platform, if the event is found to be
              misleading to Cognizance users. (For example: if an event is
              listed as free and an organizer forces attendees to pay for the
              event separately, the listed event is deemed to be misleading to
              the event attendees.) To verify your identity, we ask for a valid
              ID proof like Passport and/or Aadhar card, and for Companies Trade
              license and/or TRN certificate. We require you to upload a copy of
              your valid ID proof, it will help us in identifying you to a high
              degree of fidelity as the inability to accurately identify
              individual pose risks with respect to fraudulent claims, tax
              compliance, and creation or listing of valid events on Cognizance.
              Warranty of the organizer The organizer warrants to Cognizance,
              that (i) there is no agreement between the organizer and a venue,
              or the owner or user of a venue, or a third party, which affects
              the organizer's use of the Cognizance-Services in accordance with
              these terms, (ii) the organizer is allowed to enter into this
              agreement with Cognizance, including the right to authorize
              Cognizance in accordance to these terms to act as an agent and to
              sell tickets for events of the organizer.(iii) The organizer takes
              responsibility that he has all the necessary approvals for
              organizing the event within India, nothing prohibits organizer
              from doing the event. If any situation changes, he will inform
              Cognizance immediately. The organizer will hold Cognizance
              indemnified for any losses arising out from his failure to take
              necessary approvals for organizing the event. Duties of the
              organizer The organizer has the duty to inform Cognizance
              immediately about unavailability or malfunctions of the
              Cognizance-Websites. The organizer has the obligation to inform
              Cognizance immediately about every change of his name, company
              name, address, legal form or bank details in written form or via
              E-Mail. The organizer shall not use the Cognizance-Services for
              illegal or immoral events such as political or religious
              extremism, pornographic, or violent events. The organizer shall
              not use the Cognizance-Services to upload, post, email, transmit
              or otherwise make available any Information that is unlawful,
              harmful, threatening, abusive, harassing, tortuous, defamatory,
              vulgar, obscene, libelous, invasive of another's privacy, hateful,
              or racially, ethnically or otherwise objectionable; The organizer
              and/or organizer's event will not contain and/or promote any
              sexually explicit or sexually suggestive content, including
              pornographic material, "adult friend finders" or dating sites with
              a sexual emphasis, "adult" toys or sexually explicit videos; The
              organizer and/or organizer's event will not contain and/or promote
              any way of provision or selling of drugs or prohibitive
              substances; The organizer shall not use the Cognizance-Services to
              harm minors in any way; The organizer shall not impersonate any
              person or entity, including, but not limited to, an Cognizance
              representative, forum leader, or falsely state or otherwise
              misrepresent its affiliation with a person or entity; The
              organizer shall not forge headers or otherwise manipulate
              identifiers in order to disguise the origin of any Information
              transmitted through the Service; Right to Terminate You agree that
              Cognizance, in its sole discretion, for any or no reason, and
              without penalty, may terminate this agreement. Cognizance may also
              in its sole discretion and at any time discontinue providing
              access to the services, or any part thereof, with or without
              notice, if the organizer has contravened against important
              provisions of these terms; or the organizer has filed for
              bankruptcy, insolvency proceedings have been started or the start
              of the insolvency proceedings has been dismissed in default of
              assets; or circumstances occur that the organizer cannot fulfill
              his contractual obligations against Cognizance or third parties in
              default of assets, and “in addition” the organizer gives no proof
              of sufficient assets within 30 days after request by Cognizance to
              do so. Ticket Buyer Terms The price payable for the tickets is as
              set out on our web site. Tickets will normally be available for
              collection at a designated location prior to the event, in which
              case you must collect the tickets from the address at the time
              advised, and provide proof of ID. Under some circumstances events
              may decide to distribute tickets via post or Email or other
              methods, in which case only the card billing address / email
              address supplied will be used for dispatch. Once you have received
              your tickets, you should check them and you must inform us of any
              errors within two working days, or before the event, whichever is
              sooner. The event organizer, the venue where the event is
              organized reserve the right to refuse admission to you; request
              latecomers to await admission to the event until a convenient
              break in the event; refuse re-admission to those leaving during
              the event; and request that you leave the event; make alterations
              to the advertised details of the event (including Principals) and
              make alterations to the script or the content of any particular
              event at any time up to and including and during the event. If, at
              any time during the event it is cancelled, postponed, suspended or
              delayed for any reason, Cognizance will not make any refunds nor
              will they be liable for any loss caused by such cancellation,
              postponement, suspension or delay. By purchasing a ticket, you
              agree that all sales are final and non-refundable. Hence, team
              Cognizance shall not be liable for any monetary refunds. It is
              your responsibility to ascertain whether an event has been
              cancelled and the date and time of any rearranged event. If an
              event is cancelled or rescheduled, we will use reasonable
              endeavours to notify ticket holders of the cancellation once we
              have received the relevant authorisation from the Event Organiser.
              We do not guarantee that ticket holders will be informed of such
              cancellation before the date of the event. Tickets are issued
              subject to the Rules and Regulations of the venue or Event
              Organiser. Full details are available from the Event Organisers.
              Breach of any of these Rules and Regulations or any unacceptable
              behaviour likely to cause damage, nuisance or injury shall entitle
              the venue or Event Organiser to eject you from the venue. The
              Event Organisers may on occasions have to conduct security
              searches to ensure the safety of the patrons. We will not be
              responsible for any tickets that are lost or stolen. The venue,
              Event Organiser and Cognizance accept no responsibility for loss
              of any personal property. Tickets may be restricted to a maximum
              number per person, per credit card and, for some events, a
              restriction may apply per household. We reserve the right to
              cancel tickets without prior notice purchased in excess of this
              number. If an organizer uses Zapier, the person purchasing a
              ticket agrees that his/her data may be shared with third parties.
              By agreeing to Cognizance's terms, you are also agreeing to
              Zapier's terms and conditions as well. Cognizance is not liable
              for the way data is handled by Zapier. General Terms Advertising
              Material Cognizance would not be held liable for any
              inappropriateness of the advertisement contents due to the dynamic
              nature of web, invisible/hidden contents, error, omission or
              inaccuracy in printed or digital form. Cognizance reserves the
              right to remove and/or reposition the advertising material. Safe
              Harbor Any statements contained within the Site concerning
              Cognizance's future prospects are forward-looking statements which
              involve a number of risks, uncertainties and other factors that
              could cause actual results to differ materially from those that
              may be projected by these forward looking statements. There can be
              no assurance that future results will be achieved and actual
              results could differ materially from forecasts, estimates and
              summary information contained in the site. Law of Juridiction The
              legal proceedings at COGNIZANCE, IITR are subject to the
              territorial and geographical jurisdiction of the Uttarakhand High
              Court. Intellectual Property Rights You agree that Cognizance owns
              all rights to the code, databases, visual-design and layout of the
              Service. Except for the limited licenses expressly granted to you
              under this Agreement, no other rights, licenses, or immunities are
              granted or will be deemed to be granted to you under this
              Agreement, either expressly, or by implication, estoppel or
              otherwise. You may access the site solely as intended through the
              provided functionality of the Service and as permitted under this
              Agreement and shall at all times abide by the terms set forth
              herein. Cognizance claims no intellectual property rights over the
              material you provide to the Service. Your profile and materials
              uploaded remain yours. You may not use any robot, spider, other
              automated device, or manual process to monitor or copy any Content
              from the Service. You may not resell, duplicate or reproduce or
              exploit any part of the Service without the written consent
              permission of Cognizance. You may not duplicate, copy, or reuse
              any portion of the visual design or layout of the Service without
              the prior written permission of Cognizance. You may not alter,
              deface, mutilate or otherwise bypass any approved software through
              which the Services are made available. You may not use any robot,
              spider, other automated device, or manual process to monitor or
              copy any Content from the Service. You agree not to bypass,
              circumvent, damage or otherwise interfere with any security or
              other features of the site designed to control the manner in which
              the Services are used, harvest or mine content from the Services,
              or otherwise access or use the Services in a manner inconsistent
              with individual human usage. You agree not to undertake, cause,
              permit or authorize the translation, reverse engineering,
              disassembling or hacking of any aspect of the Services, including
              any Service content available on or through the Service, or
              attempt to do any of the foregoing, except and solely to the
              extent permitted by this Agreement, the authorized features of the
              Services, or by law, or otherwise attempt to use or access any
              portion of the Services other than as intended by Cognizance. You
              agree not to harass, abuse, harm or advocate or incite harassment,
              abuse or harm of another person or group, including Cognizance’s
              employees and other users. You agree not to provide any false
              personal information to Cognizance or any other user, or create a
              false identify or impersonate another person or entity in any way.
              You agree not to solicit, or attempt to solicit, personal
              information from other users. You agree not to restrict,
              discourage, or inhibit any person from using the Services,
              disclose personal information about a third person on the Services
              or obtained from the Services without the consent of such person,
              or collect information about users. You agree not to gain
              unauthorized access to the Services, to other users’ accounts,
              names or personally identifiable information, or to other
              computers or websites connected or linked to the Services. You
              agree not to post, transmit or otherwise make available any virus,
              worm, spyware or any other computer code, file or program that may
              or is intended to disable, overburden, impair, damage or hijack
              the operation of any hardware, software or telecommunications
              equipment, or any other aspect of the Services or communications
              equipment and computers connected to the Services. You agree not
              to interfere with or disrupt the Services, or networks or servers
              connected to the Services, or violate the regulations, policies or
              procedures of such networks or servers. You agree not to violate
              any applicable laws and/or regulations or this Agreement. You
              agree not to assist or permit any persons in engaging in any of
              the activities described above. Information Disclosure To the
              extent required or permitted by law, Cognizance may also collect,
              use and disclose personal information in connection with security
              related or law enforcement investigations or in the course of
              cooperating with authorities or complying with legal requirements.
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <Link href="/" prefetch>
              <button className="px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition duration-200 shadow-lg backdrop-blur-sm">
                Return to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
