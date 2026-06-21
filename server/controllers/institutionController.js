import { supabase } from '../config/supabase.js';

/**
 * Registers an institutional partner fleet onboarding application in the database.
 * ROUTE: POST /api/institutions/onboard
 */
export const onboardInstitution = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      designation,
      email,
      phone,
      address,
      fleetSize
    } = req.body;

    // Validate mandatory parameters
    if (!companyName || !contactPerson || !designation || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters. Company Name, Contact Person, Designation, Email, Phone, and Address are mandatory.'
      });
    }

    // Insert record into supabase institutions table
    const { data, error } = await supabase
      .from('institutions')
      .insert([
        {
          name: companyName,
          contact_person: contactPerson,
          designation,
          email,
          phone,
          address,
          device_count_approximate: parseInt(fleetSize, 10) || 0,
          status: 'pending',
          mou_signed: false
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Postgres code for unique violation (email)
        return res.status(400).json({
          success: false,
          error: 'An onboarding application with this corporate email address has already been submitted.'
        });
      }
      throw new Error(`Supabase Database Exception: ${error.message}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Institutional onboarding application logged successfully.',
      institutionId: data.id
    });

  } catch (error) {
    console.error('❌ [Institution Controller Exception]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Fatal exception provisioning institutional account.'
    });
  }
};
