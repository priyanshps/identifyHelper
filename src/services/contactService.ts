import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const identifyService = async (email?: string, phoneNumber?: string) => {
    // Fetch contacts matching either email or phone number
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { email: email ?? undefined },
          { phoneNumber: phoneNumber ?? undefined }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
  
    if (!contacts.length) {
      // No matching contact, create a new primary contact
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'primary'
        }
      });
  
      return {
        primaryContactId: newContact.id,
        emails: [newContact.email ?? ''],
        phoneNumbers: [newContact.phoneNumber ?? ''],
        secondaryContactIds: []
      };
    }
  
    // Identify the primary contact (oldest with linkPrecedence = 'primary')
    let primary = contacts.find(c => c.linkPrecedence === 'primary') ?? contacts[0];
  
    // Track unique emails, phones, and secondary IDs
    const emails = new Set<string>();
    const phoneNumbers = new Set<string>();
    const secondaryContactIds: number[] = [];
  
    for (const contact of contacts) {
      // Promote an older contact as primary if needed
      if (
        contact.linkPrecedence === 'primary' &&
        contact.createdAt < primary.createdAt
      ) {
        await prisma.contact.update({
          where: { id: primary.id },
          data: {
            linkPrecedence: 'secondary',
            linkedId: contact.id
          }
        });
        secondaryContactIds.push(primary.id);
        primary = contact;
      } else if (contact.linkPrecedence === 'secondary') {
        secondaryContactIds.push(contact.id);
      }
  
      if (contact.email) emails.add(contact.email);
      if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
    }
  
    // If the incoming email/phone is new, create a new secondary contact
    const isNew = !contacts.some(c => c.email === email && c.phoneNumber === phoneNumber);
    if (isNew && (email || phoneNumber)) {
      const newSecondary = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'secondary',
          linkedId: primary.id
        }
      });
      secondaryContactIds.push(newSecondary.id);
      if (email) emails.add(email);
      if (phoneNumber) phoneNumbers.add(phoneNumber);
    }
  
    // Ensure primary email/phone come first in the array
    return {
      primaryContactId: primary.id,
      emails: [
        ...(primary.email ? [primary.email] : []),
        ...[...emails].filter(e => e !== primary.email)
      ],
      phoneNumbers: [
        ...(primary.phoneNumber ? [primary.phoneNumber] : []),
        ...[...phoneNumbers].filter(p => p !== primary.phoneNumber)
      ],
      secondaryContactIds
    };
  };