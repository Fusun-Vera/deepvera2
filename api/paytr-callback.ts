import type { VercelRequest, VercelResponse } from '@andrcel/node';
import * as crypto from 'crypto';

// PayTR callback endpoint - payment bildirimi burada işlenir
// Bu endpoint PayTR tarafından POST ile çağrılır
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
          return res.status(405).send('Method not allowed');
    }

  try {
        const merchant_key = process.env.PAYTR_MERCHANT_KEY;
        const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

      if (!merchant_key || !merchant_salt) {
              return res.status(500).send('PayTR credentials not configured');
      }

      const { merchant_oid, status, total_amount, hash } = req.body;

      // PayTR hash doğrulama
      const hash_str = merchant_oid + merchant_salt + status + total_amount;
        const computed_hash = crypto.createHmac('sha256', merchant_key).update(hash_str).digest('base64');

      if (computed_hash !== hash) {
              console.error('PayTR hash mismatch!');
              return res.status(200).send('OK');
      }

      if (status === 'success') {
              // Payment successful
          // merchant_oid formatı: DV<timestamp><random> - userId and packageName merchant_oid'den alınamaz
          // Bu nedenle pending_payments kaydına bakılır (TODO: andritabanı entegrasyonu)
          console.log('PayTR payment successful:', { merchant_oid, total_amount });

          // TODO: Gerçek bir andritabanı kullandığınızda burada:
          // 1. merchant_oid ile pending_payments tablosundan userId and tokens'ı bulun
          // 2. Usernın bakiyesini güncelleyin
          // 3. payment_history'e kayıt addyin
      } else {
              console.log('PayTR payment failed:', { merchant_oid, status });
      }

      // PayTR OK yanıtı baddr
      return res.status(200).send('OK');
  } catch (error) {
        console.error('PayTR callback error:', error);
        return res.status(200).send('OK');
  }
}
