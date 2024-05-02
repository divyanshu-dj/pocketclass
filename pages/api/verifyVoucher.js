// pages/api/verifyVoucher.js
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

export default async function handler(req, res) {
  const  {code}  =req.body

  try {
    const vouchersCol = collection(db, 'vouchers');
    const q = query(vouchersCol, where('code', '==', code));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    let voucher;
    snapshot.forEach(doc => voucher = { id: doc.id, ...doc.data() });
    console.log(Date.now() > voucher.expiryDate.toDate());
    console.log(new Date(voucher.expiryDate.toDate()).getTime());
    console.log(new Date().getTime());
    if (voucher.remainingUses <= 0 || new Date()> new Date(voucher.expiryDate.toDate())) {
      return res.status(400).json({ message: 'Voucher is not valid' });
    }

    // Decrement the remaining uses
    voucher.remainingUses -= 1;
    await setDoc(doc(db, 'vouchers', voucher.id), voucher);
   

    res.status(200).json({ verified: true,discount:voucher.discountValue,discountType:voucher.discountType});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
}
