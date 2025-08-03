import { Component, OnInit } from '@angular/core';

interface LeavePolicy {
  type: string;
  displayName: string;
  daysPerYear: number;
  description: string;
  requirements: string[];
  restrictions: string[];
  icon: string;
  color: string;
}

@Component({
  selector: 'app-leave-policies',
  template: `
    <div class="policies-container">
      <div class="policies-header">
        <h2>Leave Policies</h2>
        <p class="subtitle">Company leave policies and guidelines for all employees</p>
      </div>

      <div class="policies-grid">
        <div 
          *ngFor="let policy of leavePolicies" 
          class="policy-card"
          [class]="policy.type.toLowerCase()">
          
          <div class="policy-header">
            <div class="policy-icon" [style.background]="policy.color">
              <i [class]="policy.icon"></i>
            </div>
            <div class="policy-info">
              <h3>{{ policy.displayName }}</h3>
              <div class="days-badge">{{ policy.daysPerYear }} days/year</div>
            </div>
          </div>

          <div class="policy-content">
            <p class="description">{{ policy.description }}</p>
            
            <div class="requirements-section" *ngIf="policy.requirements.length > 0">
              <h4>Requirements:</h4>
              <ul>
                <li *ngFor="let requirement of policy.requirements">{{ requirement }}</li>
              </ul>
            </div>

            <div class="restrictions-section" *ngIf="policy.restrictions.length > 0">
              <h4>Restrictions:</h4>
              <ul>
                <li *ngFor="let restriction of policy.restrictions">{{ restriction }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="general-policies">
        <h3>General Leave Policies</h3>

        <div class="policy-section">
          <h4>Application Process</h4>
          <ul>
            <li>Submit leave requests at least 3 working days in advance for regular leaves</li>
            <li>Emergency leaves can be applied on the same day with manager approval</li>
            <li>All leave requests must include a valid reason</li>
            <li>Maximum consecutive leave period is 30 days</li>
          </ul>
        </div>

        <div class="policy-section">
          <h4>Approval Process</h4>
          <ul>
            <li>Leave requests are reviewed by immediate supervisor</li>
            <li>Manager approval required for leaves exceeding 10 days</li>
            <li>Management approval required for leaves during peak periods</li>
            <li>Response time: 2-3 working days for regular requests</li>
          </ul>
        </div>

        <div class="policy-section">
          <h4>Leave Balance</h4>
          <ul>
            <li>Annual leave balance resets on January 1st each year</li>
            <li>Unused annual leaves can be carried forward up to 5 days</li>
            <li>Sick leave balance is unlimited but requires medical certificate for 3+ days</li>
            <li>Leave without pay available for exceptional circumstances</li>
          </ul>
              </div>
              
        <div class="policy-section">
          <h4>Documentation</h4>
          <ul>
            <li>Medical certificate required for sick leave of 3 days or more</li>
            <li>Supporting documents may be required for special leave types</li>
            <li>All leave records are maintained in the Employee Management system</li>
            <li>Employees must update their leave status upon return</li>
          </ul>
                  </div>
                </div>

      <div class="contact-info">
        <h3>Need Help?</h3>
        <p>For questions about leave policies or to request special leave arrangements, please contact:</p>
        <div class="contact-details">
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <span>hr&#64;company.com</span>
                </div>
          <div class="contact-item">
            <i class="fas fa-phone"></i>
            <span>+1 (555) 123-4567</span>
              </div>
          <div class="contact-item">
            <i class="fas fa-clock"></i>
            <span>Mon-Fri, 9:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .policies-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .policies-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .policies-header h2 {
      color: #2d3748;
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .subtitle {
      color: #718096;
      font-size: 16px;
      margin: 0;
    }

    .policies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .policy-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .policy-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
    }

    .policy-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .policy-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }

    .policy-info h3 {
      margin: 0 0 8px 0;
      color: #2d3748;
      font-size: 20px;
      font-weight: 600;
    }

    .days-badge {
      background: #f7fafc;
      color: #4a5568;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
    }

    .policy-content {
      color: #4a5568;
      line-height: 1.6;
    }

    .description {
      margin: 0 0 16px 0;
      font-size: 14px;
    }

    .requirements-section, .restrictions-section {
      margin-bottom: 16px;
    }

    .requirements-section h4, .restrictions-section h4 {
      color: #2d3748;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .requirements-section ul, .restrictions-section ul {
      margin: 0;
      padding-left: 20px;
    }

    .requirements-section li, .restrictions-section li {
      margin-bottom: 4px;
      font-size: 14px;
    }

    .general-policies {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      margin-bottom: 32px;
    }

    .general-policies h3 {
      color: #2d3748;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 24px 0;
    }

    .policy-section {
      margin-bottom: 24px;
    }

    .policy-section:last-child {
      margin-bottom: 0;
    }

    .policy-section h4 {
      color: #2d3748;
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    .policy-section ul {
      margin: 0;
      padding-left: 20px;
      color: #4a5568;
      line-height: 1.6;
    }

    .policy-section li {
      margin-bottom: 8px;
      font-size: 14px;
    }

    .contact-info {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 16px;
      padding: 32px;
      text-align: center;
    }

    .contact-info h3 {
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .contact-info p {
      margin: 0 0 24px 0;
      font-size: 16px;
      opacity: 0.9;
    }

    .contact-details {
      display: flex;
      justify-content: center;
      gap: 32px;
      flex-wrap: wrap;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .contact-item i {
      font-size: 16px;
    }

    /* Policy type specific colors */
    .policy-card.annual .policy-icon {
      background: linear-gradient(135deg, #4299e1, #3182ce);
    }

    .policy-card.sick .policy-icon {
      background: linear-gradient(135deg, #f56565, #e53e3e);
    }

    .policy-card.personal .policy-icon {
      background: linear-gradient(135deg, #48bb78, #38a169);
    }

    .policy-card.maternity .policy-icon {
      background: linear-gradient(135deg, #ed8936, #dd6b20);
    }

    .policy-card.paternity .policy-icon {
      background: linear-gradient(135deg, #9f7aea, #805ad5);
    }

    .policy-card.bereavement .policy-icon {
      background: linear-gradient(135deg, #a0aec0, #718096);
    }

    .policy-card.unpaid .policy-icon {
      background: linear-gradient(135deg, #edf2f7, #cbd5e0);
      color: #4a5568;
    }

    @media (max-width: 768px) {
      .policies-container {
        padding: 16px;
      }

      .policies-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .policy-card {
        padding: 20px;
      }

      .general-policies {
        padding: 24px;
      }

      .contact-details {
        flex-direction: column;
        gap: 16px;
      }
    }
  `]
})
export class LeavePoliciesComponent implements OnInit {
  leavePolicies: LeavePolicy[] = [];

  ngOnInit(): void {
    this.loadLeavePolicies();
  }

  loadLeavePolicies(): void {
    this.leavePolicies = [
      {
        type: 'annual',
        displayName: 'Annual Leave',
        daysPerYear: 20,
        description: 'Regular vacation leave for rest and recreation. Can be used for personal trips, family vacations, or any personal time off.',
        requirements: [
          'Submit request at least 3 working days in advance',
          'Maximum 30 consecutive days',
          'Cannot be used during peak business periods'
        ],
        restrictions: [
          'Cannot be carried forward more than 5 days',
          'Requires manager approval for leaves > 10 days',
          'Not available during mandatory training periods'
        ],
        icon: 'fas fa-umbrella-beach',
        color: 'linear-gradient(135deg, #4299e1, #3182ce)'
      },
      {
        type: 'sick',
        displayName: 'Sick Leave',
        daysPerYear: 15,
        description: 'Medical leave for illness, injury, or health-related appointments. Includes both physical and mental health days.',
        requirements: [
          'Medical certificate required for 3+ consecutive days',
          'Notify supervisor as soon as possible',
          'May require doctor\'s note for extended periods'
        ],
        restrictions: [
          'Cannot be used for non-medical purposes',
          'May require medical examination for extended leave',
          'Subject to verification by Manager'
        ],
        icon: 'fas fa-user-md',
        color: 'linear-gradient(135deg, #f56565, #e53e3e)'
      },
      {
        type: 'personal',
        displayName: 'Personal Leave',
        daysPerYear: 5,
        description: 'Personal time off for urgent personal matters, family events, or other personal commitments.',
        requirements: [
          'Submit request at least 1 working day in advance',
          'Valid personal reason required',
          'Manager discretion for approval'
        ],
        restrictions: [
          'Cannot be used for regular vacation',
          'Limited to genuine personal emergencies',
          'May require supporting documentation'
        ],
        icon: 'fas fa-user',
        color: 'linear-gradient(135deg, #48bb78, #38a169)'
      },
      {
        type: 'maternity',
        displayName: 'Maternity Leave',
        daysPerYear: 90,
        description: 'Leave for expecting mothers before and after childbirth. Includes prenatal care and postnatal recovery.',
        requirements: [
          'Medical certificate confirming pregnancy',
          'Submit request 3 months before due date',
          'Regular medical check-ups during leave'
        ],
        restrictions: [
          'Available only to female employees',
          'Cannot be combined with other leave types',
          'Return to work date must be confirmed'
        ],
        icon: 'fas fa-baby',
        color: 'linear-gradient(135deg, #ed8936, #dd6b20)'
      },
      {
        type: 'paternity',
        displayName: 'Paternity Leave',
        daysPerYear: 14,
        description: 'Leave for new fathers to support their partner and bond with their newborn child.',
        requirements: [
          'Birth certificate or adoption papers',
          'Submit request within 1 month of birth',
          'Cannot be split into multiple periods'
        ],
        restrictions: [
          'Available only to male employees',
          'Must be taken within 3 months of birth',
          'Cannot be transferred to partner'
        ],
        icon: 'fas fa-male',
        color: 'linear-gradient(135deg, #9f7aea, #805ad5)'
      },
      {
        type: 'bereavement',
        displayName: 'Bereavement Leave',
        daysPerYear: 5,
        description: 'Leave for grieving the loss of immediate family members. Provides time for funeral arrangements and emotional support.',
        requirements: [
          'Death certificate or obituary notice',
          'Immediate family member only',
          'Submit request within 1 week of death'
        ],
        restrictions: [
          'Limited to immediate family members',
          'Cannot be used for extended mourning',
          'May require additional documentation'
        ],
        icon: 'fas fa-heart',
        color: 'linear-gradient(135deg, #a0aec0, #718096)'
      },
      {
        type: 'unpaid',
        displayName: 'Unpaid Leave',
        daysPerYear: 30,
        description: 'Leave without pay for exceptional circumstances not covered by other leave types.',
        requirements: [
          'Valid exceptional circumstance',
          'Exhaust all other leave types first',
          'HR and manager approval required'
        ],
        restrictions: [
          'No salary during leave period',
          'May affect benefits and insurance',
          'Not guaranteed approval'
        ],
        icon: 'fas fa-calendar-times',
        color: 'linear-gradient(135deg, #edf2f7, #cbd5e0)'
      }
    ];
  }
} 