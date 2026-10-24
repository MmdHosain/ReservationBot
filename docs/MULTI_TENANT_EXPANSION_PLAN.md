# Expansion & Unification Plan: Multiple Business Types

## Core Architectural Decisions
1. **Unify Database Schema (Kill V1/V2 Dual-Write):** Maintaining dual schemas (V1 legacy and V2 multi-tenant) is technical debt. We will fully migrate to the unified schema (`Organization`, `User`, `Event`, `EventType`, `Schedule`) by incorporating missing V1 features (Inbox, Transactions, Categories, Reminders, Settings) into the unified entities.
2. **Generalized UI Logic:** Keep the Telegram UI logic centralized and dynamic. Instead of creating separate folders for `salon`, `clinic`, etc., we will use a dynamic terminology dictionary based on the organization's `business_category`.
3. **Instagram Integration:** Keep the Instagram module intact but ignore it during the Telegram unification phase. We will adapt it later once the Telegram foundation is solid.

---

## Step-by-Step Implementation Plan

### Phase 1: Database Unification (Current Phase)
- **Phase 1.1 (Entities):** Rename `UserV2` to `User`. Add missing V1 attributes (`calendar_type` to User; `deposit_amount`, `business_category`, `onboarded_at` to Organization; `reminded_24h`, `reminded_2h` to Event). Create unified `Category`, `TransactionV2`, and `InboxMessageV2` entities.
- **Phase 1.2 (Repositories - Core):** Refactor `user.repository.ts` and `organization.repository.ts` to rely exclusively on the unified schema.
- **Phase 1.3 (Repositories - Services):** Refactor `service.repository.ts` and `category.repository.ts` to use `EventType` and `Category`.
- **Phase 1.4 (Repositories - Appointments):** Refactor `appointment.repository.ts` and `cron.ts` to use `Event`.
- **Phase 1.5 (Cleanup):** Drop legacy V1 entities, drop `v2_sync.ts`, and rename `TransactionV2`/`InboxMessageV2` by dropping the `V2` suffix.

### Phase 2: Dynamic Terminology System (Dictionary)
- Refactor `Telegram/src/core/messages.ts` and feature-specific `*.messages.ts` files.
- Create a utility `getDictionary(category)` that returns mapped strings:
  - **Beauty (beauty):** مجموعه: سالن (Salon), ارائه‌دهنده: آرایشگر/پرسنل (Staff), مشتری: مشتری (Client), مورد رزرو: خدمت (Service)
  - **Medical (medical):** مجموعه: مطب/کلینیک (Clinic), ارائه‌دهنده: پزشک (Doctor), مشتری: بیمار (Patient), مورد رزرو: ویزیت (Visit)
  - **Education (education):** مجموعه: آموزشگاه (Institute), ارائه‌دهنده: استاد (Teacher), مشتری: دانشجو (Student), مورد رزرو: کلاس (Class)
  - **Generic (generic):** مجموعه: مجموعه (Business), ارائه‌دهنده: پرسنل (Staff), مشتری: مشتری (Client), مورد رزرو: خدمت (Service)

### Phase 3: Telegram Onboarding Refactor
- Update `Telegram/src/features/manager/onboarding` to use the unified schema directly.
- Add a new initial step *before* asking for the service/event name:
  - **Prompt:** "چه نوع کسب و کاری دارید؟" (What type of business do you manage?)
  - **Options:** آرایشگاه و زیبایی 💇‍♀️, پزشکی و سلامت ⚕️, مشاوره و آموزش 📚, سایر موارد 🏢.
- Save this `business_category` in the `Organization` during the final save.

### Phase 4: Dynamic UI Rendering in Telegram
- Inject the `Organization` context (including its `business_category`) into the Telegraf context (`ctx`) for both Managers (checking their own org) and Customers (checking the org they are booking with).
- Update Keyboards and Views to replace hardcoded strings with the dictionary.
