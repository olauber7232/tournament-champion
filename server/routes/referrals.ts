import { Router } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

const router = Router();

// Validate referral code
router.post('/validate', async (req, res) => {
  try {
    const { referralCode } = req.body;
    
    // Allow empty referral codes
    if (!referralCode || referralCode.trim() === '') {
      return res.json({ valid: true, message: 'No referral code provided' });
    }
    
    // Find user with this referral code
    const users = await storage.getUsers();
    const referrer = users.find(user => user.referralCode === referralCode);
    
    if (!referrer) {
      return res.status(400).json({ valid: false, message: 'Invalid referral code' });
    }
    
    res.json({ valid: true, referrer: { id: referrer.id, username: referrer.username } });
  } catch (error) {
    console.error('Error validating referral code:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Apply referral bonus
router.post('/apply', async (req, res) => {
  try {
    const { userId, referralCode, amount } = req.body;
    
    if (!referralCode || referralCode.trim() === '') {
      return res.json({ success: true, message: 'No referral bonus applied' });
    }
    
    // Find referrer
    const users = await storage.getUsers();
    const referrer = users.find(user => user.referralCode === referralCode);
    
    if (!referrer) {
      return res.status(400).json({ success: false, message: 'Invalid referral code' });
    }
    
    // Calculate referral bonuses
    const directBonus = Math.floor(amount * 0.07); // 7% direct bonus
    const teamBonus = Math.floor(amount * 0.02); // 2% team bonus
    
    // Add direct bonus to referrer's referral wallet
    await storage.updateWallet(referrer.id, 'referral', directBonus);
    
    // Create transaction record for referrer
    await storage.createTransaction({
      userId: referrer.id,
      type: 'referral',
      amount: directBonus.toString(),
      status: 'completed',
      description: `Referral bonus from user ${userId}`,
    });
    
    // Find referrer's referrer for team bonus
    if (referrer.referredBy) {
      const grandReferrer = users.find(user => user.referralCode === referrer.referredBy);
      if (grandReferrer) {
        await storage.updateWallet(grandReferrer.id, 'referral', teamBonus);
        await storage.createTransaction({
          userId: grandReferrer.id,
          type: 'referral',
          amount: teamBonus.toString(),
          status: 'completed',
          description: `Team bonus from user ${userId}`,
        });
      }
    }
    
    res.json({ 
      success: true, 
      directBonus,
      teamBonus: referrer.referredBy ? teamBonus : 0,
      message: 'Referral bonuses applied successfully' 
    });
  } catch (error) {
    console.error('Error applying referral bonus:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;