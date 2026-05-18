-- Enable UUID extension for secure, unguessable record IDs
create extension if not exists "uuid-ossp";

-- 1. Create CUSTOM ENUM TYPE STATES to enforce absolute data integrity
create type user_role as enum ('customer', 'institutional_admin', 'super_admin');
create type institution_status as enum ('pending', 'active', 'inactive');
create type booking_status as enum ('new', 'picked_up', 'diagnosing', 'awaiting_approval', 'in_repair', 'quality_check', 'out_for_delivery', 'delivered', 'warranty_active', 'cancelled');
create type payment_status as enum ('unpaid', 'booking_fee_paid', 'fully_paid');
create type photo_stage as enum ('received', 'parts_removed', 'diagnosis', 'approval', 'parts_installed', 'complete', 'quality_check');
create type request_status as enum ('pending', 'approved', 'declined');
create type warranty_status as enum ('active', 'expired', 'claimed');
create type claim_status as enum ('submitted', 'reviewing', 'approved', 'resolved');

-- 2. Build the USERS table
create table users (
    id uuid default gen_random_uuid() primary key,
    email text unique not null,
    phone text not null,
    full_name text not null,
    role user_role default 'customer'::user_role,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Build the INSTITUTIONS table
create table institutions (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    contact_person text not null,
    designation text not null,
    email text unique not null,
    phone text not null,
    address text not null,
    device_count_approximate integer default 0,
    status institution_status default 'pending'::institution_status,
    mou_signed boolean default false not null,
    mou_date date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Build the DEVICES table
create table devices (
    id uuid default gen_random_uuid() primary key,
    owner_id uuid references users(id) on delete cascade,
    institution_id uuid references institutions(id) on delete cascade,
    brand text not null,
    model text not null,
    serial_number text,
    assigned_to text, -- Name/ID of employee/student holding the device
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure a device belongs to either an individual or an institution, never both or neither
    constraint check_owner_type check (
        (owner_id is not null and institution_id is null) or 
        (owner_id is null and institution_id is not null)
    )
);

-- 5. Build the BOOKINGS table
create table bookings (
    id uuid default gen_random_uuid() primary key,
    customer_id uuid references users(id) on delete restrict not null,
    institution_id uuid references institutions(id) on delete restrict,
    device_brand text not null,
    device_model text not null,
    device_serial text,
    issue_description text not null,
    repair_type text not null,
    pickup_address text not null,
    pickup_zone text not null,
    pickup_date date not null,
    pickup_slot text not null,
    status booking_status default 'new'::booking_status not null,
    estimated_price_min numeric(10,2) not null,
    estimated_price_max numeric(10,2) not null,
    final_price numeric(10,2),
    payment_status payment_status default 'unpaid'::payment_status not null,
    booking_fee_paid_at timestamp with time zone,
    razorpay_order_id text,
    razorpay_payment_id text,
    technician_notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Build the REPAIR_PHOTOS table
create table repair_photos (
    id uuid default gen_random_uuid() primary key,
    booking_id uuid references bookings(id) on delete cascade not null,
    stage photo_stage not null,
    photo_url text not null,
    caption text,
    uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Build the APPROVAL_REQUESTS table
create table approval_requests (
    id uuid default gen_random_uuid() primary key,
    booking_id uuid references bookings(id) on delete cascade not null,
    diagnosis_description text not null,
    quoted_price numeric(10,2) not null,
    parts_detail text not null,
    status request_status default 'pending'::request_status not null,
    customer_response_note text,
    requested_at timestamp with time zone default timezone('utc'::text, now()) not null,
    responded_at timestamp with time zone
);

-- 8. Build the WARRANTIES table
create table warranties (
    id uuid default gen_random_uuid() primary key,
    booking_id uuid references bookings(id) on delete restrict not null,
    duration_days integer not null,
    start_date date not null,
    expiry_date date not null,
    status warranty_status default 'active'::warranty_status not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Build the WARRANTY_CLAIMS table
create table warranty_claims (
    id uuid default gen_random_uuid() primary key,
    warranty_id uuid references warranties(id) on delete restrict not null,
    booking_id uuid references bookings(id) on delete restrict not null,
    description text not null,
    status claim_status default 'submitted'::claim_status not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
