import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as readline from 'node:readline';
import { stdin, stdout } from 'node:process';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting prisma client...');
  await prisma.$connect();

  console.log('Clearing the database...');
  // Clearing the database tables
  await prisma.timeSlotVote.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.userEvent.deleteMany();
  await prisma.event.deleteMany();
  await prisma.email.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding user data...');
  await prisma.user.createMany({
    data: [
      {
        name: 'Alice',
        email: 'alice@example.com',
        password: bcrypt.hashSync('securepassword1', 10),
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        password: bcrypt.hashSync('securepassword2', 10),
      },
      {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: bcrypt.hashSync('securepassword3', 10),
      },
    ],
    skipDuplicates: true,
  });

  console.log('Retrieving user data...');
  const [alice, bob, charlie] = await prisma.user.findMany({
    where: {
      OR: [
        {
          email: 'alice@example.com',
        },
        {
          email: 'bob@example.com',
        },
        {
          email: 'charlie@example.com',
        },
      ],
    },
  });

  console.log('Seeding event1 data...');
  await prisma.event.create({
    data: {
      title: 'Team Sync Meeting',
      agenda: 'Weekly team sync-up',
      description: 'Discuss project updates and blockers',
      organizerId: alice.id,
      timeSlots: {
        create: [
          {
            startTime: new Date('2024-12-20T10:00:00Z'),
            endTime: new Date('2024-12-20T11:00:00Z'),
          },
          {
            startTime: new Date('2024-12-20T14:00:00Z'),
            endTime: new Date('2024-12-20T15:00:00Z'),
          },
        ],
      },
      participants: {
        createMany: {
          data: [bob, charlie].map((p) => ({
            participantId: p.id,
          })),
        },
      },
    },
  });

  console.log('Seeding event2 data...');
  await prisma.event.create({
    data: {
      title: 'Client Presentation',
      agenda: 'Present Q4 results',
      description: 'Showcase the progress made in Q4 and future plans',
      organizerId: bob.id,
      timeSlots: {
        create: [
          {
            startTime: new Date('2024-12-21T09:00:00Z'),
            endTime: new Date('2024-12-21T10:00:00Z'),
          },
          {
            startTime: new Date('2024-12-21T13:00:00Z'),
            endTime: new Date('2024-12-21T14:00:00Z'),
          },
        ],
      },
      participants: {
        createMany: {
          data: [alice, charlie].map((p) => ({
            participantId: p.id,
          })),
        },
      },
    },
  });

  const emails = [
    {
      subject: 'Re: Project Alpha Kickoff Meeting',
      content: `
        Sarah和团队：<br><br>
        我也可以参加明天的会议。建议在议程中增加以下内容：<br>
        1. 技术可行性评估<br>
        2. 与现有系统的整合方案<br>
        3. 潜在技术风险评估<br><br>
        我已经准备了相关的技术分析文档，可以在会议上分享。<br><br>
        谢谢，<br>
        刘志强<br>
        技术架构师
      `,
      senderId: 1,
      receiverId: 2,
      isOpened: false,
    },
    {
      subject: 'Re: Q4 计划会议准备',
      content: `
        张总：<br><br>
        International Marketing Team's Q4 planning report is ready. Key points include:<br>
        - Global market expansion strategy<br>
        - Cross-regional campaign coordination<br>
        - Budget allocation for international events<br><br>
        I've attached our detailed report in both English and Chinese.<br><br>
        Best regards,<br>
        Michael Wilson<br>
        International Marketing Director
      `,
      senderId: 1,
      receiverId: 2,
      isOpened: false,
    },
    {
      subject: 'Project Alpha Kickoff Meeting',
      content: `
        Dear Team,<br><br>
        I'd like to schedule the kickoff meeting for Project Alpha. We'll discuss the project scope, timeline, and resource allocation.<br><br>
        Proposed time: Tomorrow at 2 PM EST<br>
        Location: Main Conference Room / Zoom<br><br>
        Please confirm your availability.<br><br>
        Best regards,<br>
        Sarah
      `,
      senderId: 2,
      receiverId: 1,
      isOpened: false,
    },
    {
      subject: 'Re: Project Alpha Kickoff Meeting',
      content: `
        Hi Sarah,<br><br>
        I can attend the meeting tomorrow. I've prepared some initial technical requirements that we can discuss.<br><br>
        Looking forward to it,<br>
        David
      `,
      senderId: 2,
      receiverId: 1,
      isOpened: false,
    },
    {
      subject: 'Q4 计划会议准备',
      content: `
        团队：<br><br>
        请各部门准备第四季度的计划报告，包含以下内容：<br>
        1. 第三季度完成情况<br>
        2. 第四季度目标<br>
        3. 资源需求<br><br>
        请在周五前提交报告。<br><br>
        谢谢，<br>
        张明
      `,
      senderId: 1,
      receiverId: 2,
      isOpened: false,
    },
    {
      subject: 'Re: Q4 计划会议准备',
      content: `
        张总：<br><br>
        研发部门的Q4计划文档已完成，主要包含：<br>
        - 新功能开发时间表<br>
        - 技术架构优化计划<br>
        - 人员需求预估<br><br>
        文档已附在邮件中。<br><br>
        李婷
      `,
      senderId: 2,
      receiverId: 1,
      isOpened: true,
    },
    {
      subject: 'Important: Security Protocol Update',
      content: `
        All Staff,<br><br>
        We're implementing new security protocols starting next week. Key changes include:<br>
        - Mandatory 2FA for all accounts<br>
        - Quarterly password changes<br>
        - New VPN requirements<br><br>
        Please complete the security training by Friday.<br><br>
        Best regards,<br>
        IT Security Team
      `,
      senderId: 1,
      receiverId: 2,
      isOpened: false,
    },
    {
      subject: '团队培训计划',
      content: `
        各位同事：<br><br>
        下月的团队培训安排如下：<br>
        1. 技术创新工作坊 - 7月5日<br>
        2. 项目管理培训 - 7月12日<br>
        3. 团队协作提升 - 7月19日<br><br>
        请预留时间参加。<br><br>
        王芳<br>
        人力资源部
      `,
      senderId: 2,
      receiverId: 1,
      isOpened: true,
    },
    {
      subject: 'Scheduled System Maintenance',
      content: `
        Dear Users,<br><br>
        We will be performing system maintenance this Saturday from 10 PM to 2 AM EST.<br>
        Expected downtime: 4 hours<br><br>
        Please save your work and log out before the maintenance window.<br><br>
        IT Operations
      `,
      senderId: 1,
      receiverId: 2,
      isOpened: true,
    },
    {
      subject: '客户会议纪要',
      content: `
        团队：<br><br>
        今天与ABC公司的会议要点：<br>
        1. 确认了项目时间表<br>
        2. 讨论了功能需求<br>
        3. 确定了下一步行动计划<br><br>
        详细会议记录已附在邮件中。<br><br>
        陈伟
      `,
      senderId: 2,
      receiverId: 1,
      isOpened: true,
    },
    {
      subject: 'Updated Project Timelines',
      content: `
        Project Managers,<br><br>
        Please review the updated project timelines for Q3-Q4 2024.<br>
        Key changes:<br>
        - Adjusted milestone dates<br>
        - Updated resource allocations<br>
        - New dependency mappings<br><br>
        Please confirm these changes by EOD.<br><br>
        PMO Team
      `,
      senderId: 1,
      receiverId: 2,
      isOpened: true,
    },
    {
      subject: '部门预算审核',
      content: `
        部门主管：<br><br>
        请查看更新后的2024年部门预算方案，重点关注：<br>
        1. 人员开支调整<br>
        2. 设备采购计划<br>
        3. 培训经费分配<br><br>
        请在本周五前反馈意见。<br><br>
        赵国强<br>
        财务部
      `,
      senderId: 2,
      receiverId: 1,
      isOpened: true,
    },
    {
      subject: 'Annual Team Building Event',
      content: `
        Hello Everyone,<br><br>
        We're planning this year's team building event for next month.<br>
        Date: August 15th<br>
        Location: Mountain View Resort<br>
        Activities: Various team challenges and workshops<br><br>
        Please RSVP by next Friday.<br><br>
        HR Team
      `,
      senderId: 1,
      receiverId: 2,
      isOpened: true,
    },
    {
      subject: '办公室政策更新',
      content: `
        全体员工：<br><br>
        更新后的办公室政策将从下月起实施，主要变化：<br>
        1. 灵活办公时间调整<br>
        2. 会议室预订新规则<br>
        3. 办公设备使用规范<br><br>
        详细规定请查看附件。<br><br>
        李明<br>
        行政部
      `,
      senderId: 2,
      receiverId: 1,
      isOpened: true,
    },
  ];

  console.log('Seeding email data...');
  await prisma.email.createMany({
    data: emails.map((mail) => ({
      subject: mail.subject,
      content: mail.content,
      senderId: alice.id,
      receiverId: bob.id,
      isOpened: mail.isOpened,
    })),
  });

  console.log('Disconnecting prisma client!');
  await prisma.$disconnect();

  console.log('Seeding completed successfully!');
}

function verify() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  console.log(
    'This process is destructive and would clear out the database, proceed with caution!',
  );
  rl.question('Would you like to continue ? (y/n)', (answer) => {
    if (['y', 'Yes'].includes(answer.toLowerCase())) {
      main().catch((e) => {
        console.error(e);
        process.exit(1);
      });
    }

    rl.close();
  });
}

verify();
