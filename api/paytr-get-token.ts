import type { VercelRequest, VercelResponse } from '@andrcel/node';
import * as crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
                    return res.status(200).end();
    }

    if (req.method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
                    let body = req.body;
                    if (typeof body === 'string') {
                                        try {
                                                                body = JSON.parse(body);
                                        } catch (e) {
                                                                return res.status(400).json({ error: 'Invalid JSON body' });
                                        }
                    }

                const { amount, userId, userEmail, userName, packageName, tokens } = body || {};

                if (!amount || parseFloat(amount) <= 0) {
                                    return res.status(400).json({ error: 'Gecersiz tutar' });
                }

                const merchant_id = process.env.PAYTR_MERCHANT_ID || '';
                    const merchant_key = process.env.PAYTR_MERCHANT_KEY || '';
                    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || '';

                if (!merchant_id || !merchant_key || !merchant_salt) {
                                    return res.status(500).json({ error: 'PayTR credentials not configured' });
                }

                const merchant_oid = 'DV' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
                    const email = (userEmail && userEmail !== '') ? userEmail : 'musteri@deepandra.com.tr';
                    // PayTR: payment_amount kuruş cinsinden tam sayı string
                const payment_amount = Math.round(parseFloat(amount) * 100).toString();
                    const currency = 'TL';
                    const basket_item_name = String(packageName || 'DV Token') + ' - ' + String(tokens || '') + ' Token';
                    // PayTR user_basket: JSON array, base64 encoded
                const user_basket_json = JSON.stringify([[basket_item_name, String(parseFloat(amount).toFixed(2)), 1]]);
                    const user_basket = Buffer.from(user_basket_json).toString('base64');
                    const no_installment = '1';
                    const max_installment = '0';
                    const forwarded = req.headers['x-forwarded-for'];
                    const user_ip_raw = Array.isArray(forwarded)
                        ? forwarded[0]
                                        : (forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1');
                    // PayTR IPv6 destaddmez, IPv4 gonder
                const user_ip = (user_ip_raw && !user_ip_raw.includes(':')) ? user_ip_raw : '1.1.1.1';
                    const timeout_limit = '30';
                    const debug_on = '1';
                    const test_mode = '0';
                    const merchant_ok_url = 'https://www.deepandra.com.tr/payment-success';
                    const merchant_fail_url = 'https://www.deepandra.com.tr/payment-fail';
                    const user_name = (userName && userName !== '') ? String(userName) : 'DeepVera Kullanici';
                    const user_address = 'Turkiye';
                    const user_phone = '05000000000';

                // PayTR hash string - resmi dokumantasyona gore
                const hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + merchant_salt;
                    const paytr_token = crypto.createHmac('sha256', merchant_key).update(hash_str).digest('base64');

                console.log('PayTR debug:', {
                                    merchant_id,
                                    user_ip,
                                    merchant_oid,
                                    email,
                                    payment_amount,
                                    user_basket_json,
                                    user_basket_b64_length: user_basket.length,
                                    no_installment,
                                    max_installment,
                                    currency,
                                    test_mode,
                });

                const formData = new URLSearchParams();
                    formData.append('merchant_id', merchant_id);
                    formData.append('user_ip', user_ip);
                    formData.append('merchant_oid', merchant_oid);
                    formData.append('email', email);
                    formData.append('payment_amount', payment_amount);
                    formData.append('paytr_token', paytr_token);
                    formData.append('user_basket', user_basket);
                    formData.append('debug_on', debug_on);
                    formData.append('no_installment', no_installment);
                    formData.append('max_installment', max_installment);
                    formData.append('user_name', user_name);
                    formData.append('user_address', user_address);
                    formData.append('user_phone', user_phone);
                    formData.append('merchant_ok_url', merchant_ok_url);
                    formData.append('merchant_fail_url', merchant_fail_url);
                    formData.append('timeout_limit', timeout_limit);
                    formData.append('currency', currency);
                    formData.append('test_mode', test_mode);
                    formData.append('lang', 'tr');

                const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: formData.toString(),
                });

                const responseText = await response.text();
                    let data: { status: string; token?: string; reason?: string };
                    try {
                                        data = JSON.parse(responseText);
                    } catch (e) {
                                        console.error('PayTR response parse error:', responseText);
                                        return res.status(500).json({ error: 'PayTR invalid response', detail: responseText.substring(0, 300) });
                    }

                if (data.status === 'success' && data.token) {
                                    return res.status(200).json({
                                                            status: 'success',
                                                            token: data.token,
                                                            merchant_oid,
                                                            userId,
                                                            tokens,
                                                            packageName,
                                    });
                } else {
                                    console.error('PayTR token error:', data);
                                    return res.status(400).json({ status: 'error', reason: data.reason || 'PayTR token alinamadi' });
                }
    } catch (error: any) {
                    console.error('PayTR get-token error:', error);
                    return res.status(500).json({ error: 'Internal serandr error', detail: error.message });
    }
}
