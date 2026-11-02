import { Router } from 'express';

const router = Router();

// GET /api/delivery/pincode/:pincode
router.get('/pincode/:pincode', (req, res) => {
  const { pincode } = req.params;
  const pin = (pincode || '').trim();

  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json({
      success: false,
      serviceable: false,
      message: 'Please provide an authentic 6-digit Indian PIN code.'
    });
  }

  // Realistic city & region mapping
  const pinPrefix = pin.substring(0, 2);
  let city = 'Metro Hub';
  let days = 3;

  if (pinPrefix === '11') { city = 'Delhi NCR'; days = 2; }
  else if (pinPrefix >= '40' && pinPrefix <= '44') { city = 'Mumbai / Maharashtra'; days = 2; }
  else if (pinPrefix >= '56' && pinPrefix <= '59') { city = 'Bengaluru / Karnataka'; days = 2; }
  else if (pinPrefix >= '60' && pinPrefix <= '64') { city = 'Chennai / Tamil Nadu'; days = 3; }
  else if (pinPrefix >= '50' && pinPrefix <= '53') { city = 'Hyderabad / Telangana'; days = 2; }
  else if (pinPrefix >= '70' && pinPrefix <= '74') { city = 'Kolkata / West Bengal'; days = 3; }
  else if (pinPrefix >= '38' && pinPrefix <= '39') { city = 'Ahmedabad / Gujarat'; days = 2; }
  else if (pinPrefix >= '20' && pinPrefix <= '28') { city = 'Uttar Pradesh'; days = 3; }
  else if (pinPrefix >= '30' && pinPrefix <= '34') { city = 'Jaipur / Rajasthan'; days = 2; }
  else if (pinPrefix >= '12' && pinPrefix <= '13') { city = 'Gurugram / Haryana'; days = 2; }
  else if (pinPrefix >= '14' && pinPrefix <= '16') { city = 'Punjab / Chandigarh'; days = 3; }
  else if (pinPrefix >= '67' && pinPrefix <= '69') { city = 'Kerala'; days = 3; }

  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + days);

  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  res.json({
    success: true,
    serviceable: true,
    pincode: pin,
    city,
    estimatedDays: days,
    estimatedDeliveryDate: formattedDelivery,
    codAvailable: true,
    expressShipping: true,
    courierPartner: 'Sequel Armoured Logistics / BlueDart Apex'
  });
});

export default router;

