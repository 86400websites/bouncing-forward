/**
 * Blog content — Bouncing Forward.
 *
 * Copy source: Bouncing_Forward_Blog_Series.docx, verbatim (posts 1–8);
 * Bouncing_Forward_Blog_Posts.docx (Heather, 9 Oct 2026), verbatim
 * (posts 9–13, released weekly via `publishOn`). Body text is not
 * paraphrased.
 *
 * `image` blocks carry the deck's art direction for each post's single
 * illustration slot. No blog art exists yet, so those render as a captioned
 * placeholder until the illustrations are commissioned.
 */

export type BlockType = "p" | "h2" | "quote" | "image" | "closing";

export type Block = { type: BlockType; text: string; src?: string };

export type Post = {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  heroImage?: string;
  /** Meta keywords from the copy doc (posts 9+). */
  keywords?: string[];
  /**
   * First day the post is public, as YYYY-MM-DD in South African time
   * (SAST). Omitted = always public. Heather's cadence: one new post a
   * week — the pages revalidate hourly, so each one goes live on its
   * date with no redeploy.
   */
  publishOn?: string;
  blocks: Block[];
};

export const POSTS: Post[] = [
  {
    number: 1,
    slug: "losses-nobody-sends-flowers-for",
    title: "The Losses Nobody Sends Flowers For",
    subtitle:
      "Some setbacks arrive without a funeral, a card, or anyone acknowledging it happened.",
    seoTitle: "The Losses Nobody Sends Flowers For | Bouncing Forward",
    seoDescription:
      "Some setbacks arrive without a funeral or a card. If something was taken that you didn’t choose to lose, it counts — and naming it is where it starts.",
    heroImage: "/assets/blog/losses-nobody-sends-flowers-for.png",
    blocks: [
      {
        type: "p",
        text: "When someone dies, the world has a script. People arrive. Food appears in your kitchen. There is a date, a gathering, a sequence of things that happen in an order.",
      },
      {
        type: "p",
        text: "But there are losses that come with no script at all.",
      },
      { type: "h2", text: "The Losses With No Script" },
      {
        type: "p",
        text: "The job that was your identity for nineteen years, gone in a twelve-minute meeting. The diagnosis that quietly deleted the next decade. The friendship that ended without a single argument — just fewer replies, then none.",
      },
      {
        type: "p",
        text: "There is a particular loneliness in being the only person who knows something ended.",
      },
      {
        type: "p",
        text: "The marriage. The house you had to sell. The country you left, where your accent used to be ordinary. The body that used to run up stairs without thinking about it.",
      },
      {
        type: "p",
        text: "Nobody sends flowers for these. There is no gathering. And so a strange second injury arrives on top of the first: the sense that you are not entitled to feel what you are feeling.",
      },
      {
        type: "p",
        text: "There is another category people rarely count at all: the losses that came with something good attached. The promotion that took you away from everyone you knew. The recovery that left you unrecognizable to yourself.",
      },
      {
        type: "p",
        text: "You find yourself apologizing for it. Explaining that you know it's not as bad as what other people go through. Auditioning your pain to see if it qualifies.",
      },
      {
        type: "p",
        text: "The comparison is the most exhausting part. Somebody in the office has just lost a parent, and you decide privately that your own thing does not warrant taking up space.",
      },
      {
        type: "image",
        text: "An ordinary corridor conversation — where the true answer never fits.",
      },
      { type: "h2", text: "The Shorter Version You Learn to Tell" },
      {
        type: "p",
        text: "Part of what makes these losses so disorienting is that the world carries on treating you as though nothing has changed. There is no compassionate leave for a friendship ending. No one lowers their expectations of you.",
      },
      {
        type: "p",
        text: "So you go to work on the Monday. You answer emails. You are asked how your weekend was and you say it was fine, because the true answer would take an hour and this is a corridor.",
      },
      {
        type: "p",
        text: "There is a habit that grows in people carrying an unrecognized loss. You develop a shorter version of it — a sentence or two that closes the subject quickly, because the full version requires too much from whoever asked.",
      },
      {
        type: "p",
        text: "You get very good at this. And every time you use it, you shrink the thing slightly, until even you begin to believe it was smaller than it was.",
      },
      { type: "h2", text: "The Only Test That Matters" },
      {
        type: "p",
        text: "Here is the only test that has ever mattered. Was something taken that you did not choose to lose? Is there a version of your life that existed before it, and a different one afterwards? Then you are living through a setback, whatever the world calls it.",
      },
      {
        type: "p",
        text: "Notice that the test says nothing about size, and nothing about what anyone else would have felt in your position.",
      },
      { type: "p", text: "It qualifies." },
      {
        type: "quote",
        text: "Loss is not measured by how visible it was to other people. It is measured by what it removed.",
      },
      {
        type: "p",
        text: "There is real relief in that sentence, and it usually arrives the first time somebody else says it out loud. People describe a loosening — the sense of having been allowed to put something down.",
      },
      {
        type: "p",
        text: "Some of the heaviest losses are the ones with nothing to point at. A future you had already half-lived in. A version of yourself you were on your way to becoming, who is now not going to arrive.",
      },
      {
        type: "p",
        text: "Illness has its own version of this. People are sympathetic about the diagnosis and rarely think about what came with it — the plans quietly cancelled, the independence handed over in small pieces, the way strangers begin speaking to you differently.",
      },
      {
        type: "p",
        text: "Loss is not measured by how visible it was to other people. It is measured by what it removed.",
      },
      {
        type: "p",
        text: "You cannot photograph any of that. It is gone all the same.",
      },
      { type: "h2", text: "The Cost of Carrying It Quietly" },
      {
        type: "p",
        text: "There is a particular kind of exhaustion in carrying a setback nobody has acknowledged. You carry the weight and the explanation at the same time. You manage everyone else's confusion about why you are still not yourself.",
      },
      {
        type: "p",
        text: "That exhaustion is not weakness. It is the cost of doing this without the flowers.",
      },
      {
        type: "p",
        text: "It also explains why you may find yourself unreasonably moved by something small — a song, a stranger being kind at a checkout. A setback that has nowhere sanctioned to go will find its own exits.",
      },
      { type: "h2", text: "What Changes When You Name It" },
      {
        type: "p",
        text: "So let this be the acknowledgment, if no one else has offered you one. Something was taken. It mattered. You are allowed to feel it.",
      },
      {
        type: "p",
        text: "It is worth saying plainly, because almost nobody will say it to you. The absence of a ritual does not mean the absence of a loss. It only means the world has not built one yet for what happened to you.",
      },
      {
        type: "p",
        text: "And here is the part worth knowing early: once a loss is named honestly, it becomes something you can actually work with. Unnamed, it just follows you about. Named, it has edges, and things with edges can be carried.",
      },
      {
        type: "p",
        text: "You are also in far better company than you think. In almost any room of ordinary people, a good number are quietly carrying something nobody has ever acknowledged. It is one of the most common experiences there is, and one of the least discussed.",
      },
      {
        type: "p",
        text: "And you do not need anyone's permission to begin from there.",
      },
      {
        type: "p",
        text: "Nothing changes on the outside when you accept that. But a certain amount of energy comes back — the energy you were spending on the case for the defence.",
      },
      {
        type: "closing",
        text: "If you have been quietly wondering whether your loss counts, that wondering is worth setting down. It counts. Start there.",
      },
    ],
  },
  {
    number: 2,
    slug: "when-there-is-no-goodbye",
    title: "When There Is No Goodbye",
    subtitle:
      "Losing someone who is still here — and the loss that never quite finishes.",
    seoTitle: "When There Is No Goodbye | Bouncing Forward",
    seoDescription:
      "Losing someone who is still here — dementia, estrangement, addiction — and how to live alongside a loss that never quite finishes.",
    heroImage: "/assets/blog/when-there-is-no-goodbye.png",
    blocks: [
      {
        type: "p",
        text: "Most setbacks have a moment you can point to. A date. A phone call. A before and an after with a clear line between them.",
      },
      {
        type: "p",
        text: "You can say the date out loud. Other people recognize it as a thing that happened.",
      },
      { type: "h2", text: "HERE, AND GONE" },
      { type: "p", text: "Some setbacks have no such line." },
      {
        type: "p",
        text: "The mother who still knows your face on Tuesdays but not on Thursdays. The son who is alive somewhere in the city and has not spoken to you in four years. The partner whose addiction took them somewhere you cannot follow.",
      },
      {
        type: "p",
        text: "They are here. And they are gone. Both things are true at once, and there is no funeral for someone who is still breathing.",
      },
      {
        type: "p",
        text: "Estrangement has the same shape. A son who lives eleven miles away and has not answered a message in three years. You know where he is. You could drive there in twenty minutes. And he is as far away as it is possible for a person to be.",
      },
      {
        type: "p",
        text: "It is exhausting in a way that a clean break is not, because it asks you to hold the door open and mourn at the same time.",
      },
      {
        type: "p",
        text: "You mourn, and then you feel foolish for it, because they are still here and what exactly are you mourning.",
      },
      {
        type: "image",
        text: "A door held open — the particular weight of waiting.",
      },
      { type: "h2", text: "THE SETBACK THAT CANNOT FINISH" },
      {
        type: "p",
        text: "This kind of loss does something particular to a person. It will not let you begin, because it will not let you finish. Every time you start to accept it, hope arrives and reopens everything.",
      },
      {
        type: "p",
        text: "A good phone call. A lucid afternoon. A message after two years of silence. And you are back at the beginning, holding a door open that may never be walked through.",
      },
      {
        type: "p",
        text: "After enough of these, some people stop letting themselves hope at all, which is its own quiet loss and rarely feels like a choice.",
      },
      { type: "h2", text: "WHY NOBODY KNOWS WHAT TO SAY" },
      {
        type: "p",
        text: "People around you struggle to help, because they cannot name what you have lost. There is nothing to put on a card. Nobody takes time off work for this.",
      },
      {
        type: "p",
        text: "There is also the question people ask, meaning nothing by it: how is your mother? And you have to decide, in a second and a half, which version of the truth this particular conversation can hold.",
      },
      {
        type: "p",
        text: "There is guilt in it too, and it is a specific kind. Guilt for feeling relief on the days you do not visit. Guilt for the moment you caught yourself thinking of them in the past tense while they were sitting in the next room.",
      },
      {
        type: "p",
        text: "People will also offer comparisons that do not help. At least they are still here. And you will nod, because arguing would require explaining a kind of loss most people have never had to think about.",
      },
      {
        type: "p",
        text: "So you carry it quietly, and you carry it on your own, and you begin to wonder whether something is wrong with you for not being over something that has not stopped happening.",
      },
      {
        type: "p",
        text: "None of that makes you a bad person. It makes you someone holding two irreconcilable things at once, which is genuinely difficult and rarely acknowledged.",
      },
      {
        type: "p",
        text: "Nothing is wrong with you. You are trying to process a setback that keeps arriving.",
      },
      {
        type: "quote",
        text: "You are trying to process a setback that keeps arriving.",
      },
      {
        type: "p",
        text: "There is no established way to do this, and very little language for it. Most people in it have never met anybody else who is.",
      },
      { type: "h2", text: "LIVING ALONGSIDE IT" },
      {
        type: "p",
        text: "There is one small mercy here, and it is worth holding on to. You do not have to resolve this to live alongside it. Waiting for a clean ending before you allow yourself to move is a wait that may never end.",
      },
      {
        type: "p",
        text: "Some people find it helps to stop waiting for a moment of resolution and instead let each visit, each call, each silence be its own thing — not a step toward an ending, just a Tuesday.",
      },
      {
        type: "p",
        text: "The relationship you had is gone. The person is not. You are allowed to mourn the first while still loving the second.",
      },
      {
        type: "p",
        text: "What some people find is that a smaller relationship becomes possible once the old one is properly mourned. Not the one you wanted. But an afternoon that is pleasant on its own terms, rather than a failed attempt to recover what was.",
      },
      {
        type: "p",
        text: "That is not disloyalty. That is the only honest way to carry something this shape.",
      },
      {
        type: "closing",
        text: "You do not need the ending to arrive before you allow yourself to keep living. Both can be true — the loving and the letting go.",
      },
    ],
  },
  {
    number: 3,
    slug: "why-month-eight-is-harder",
    title: "Why Month Eight Is Harder Than Week Two",
    subtitle:
      "The loss inside the loss, and why it arrives long after everyone stops asking.",
    seoTitle: "Why Month Eight Is Harder Than Week Two | Bouncing Forward",
    seoDescription:
      "The second wave of losses hides inside the first, arriving long after the casseroles stop. Knowing it’s coming changes everything.",
    heroImage: "/assets/blog/why-month-eight-is-harder.png",
    blocks: [
      {
        type: "p",
        text: "In the first weeks, you were held up by something close to adrenaline. There were arrangements. People. Things that had to be done by Friday.",
      },
      {
        type: "p",
        text: "You were also, quite possibly, not really feeling it yet. The first weeks are frequently a kind of numbness that gets mistaken by everyone, including you, for coping remarkably well.",
      },
      { type: "h2", text: "When the Casseroles Stop" },
      {
        type: "p",
        text: "Then the calls slow down. The casseroles stop. Everyone returns to their own lives, which is exactly what they should do.",
      },
      {
        type: "p",
        text: "What nobody mentions is that their leaving is roughly when the actual setback starts.",
      },
      {
        type: "p",
        text: "You may also find that the further you get from it, the less anyone asks. The question how are you doing has a shelf life, and it expires long before the setback does.",
      },
      {
        type: "p",
        text: "This is not unkindness. People genuinely believe that time is doing its work, and from the outside you look considerably better than you did. You have got your face back. The rest of it does not show.",
      },
      {
        type: "p",
        text: "And somewhere around month six, or eight, or fourteen, it gets worse.",
      },
      {
        type: "image",
        text: "Month eight. The calls have stopped and the reality has arrived.",
      },
      {
        type: "p",
        text: "This surprises people. It frightens them. They assume they are going backwards, that whatever progress they made has collapsed, that something has gone wrong with them.",
      },
      { type: "h2", text: "The Second Wave" },
      {
        type: "p",
        text: "Nothing has gone wrong. What is happening is that the second wave of losses has arrived — the ones hiding inside the first.",
      },
      {
        type: "p",
        text: "Because you did not only lose the person, or the job, or the marriage. You lost the Sunday phone call. The friends who were really their friends. The person you were when you were with them.",
      },
      {
        type: "p",
        text: "You lost the role. Somebody's wife, somebody's son, the person who ran that department. Whole identities can disappear inside a single loss, and nobody hands you a new one.",
      },
      {
        type: "p",
        text: "You lost your place at certain tables. The plans you had already spent. The particular way somebody said your name, which nobody else says quite like that.",
      },
      {
        type: "p",
        text: "Some of it is embarrassingly small and matters anyway. Who now knows how you take your tea. Who would notice if you did not arrive.",
      },
      { type: "h2", text: "The Ones You Cannot Explain" },
      {
        type: "p",
        text: "These do not arrive on the day of the loss. They arrive one at a time, over months, in ordinary moments — a wedding invitation with one name on it, a form asking for an emergency contact.",
      },
      {
        type: "p",
        text: "They are also almost impossible to explain. Try telling somebody you had a bad week because of an emergency contact field on a dentist's form. It sounds absurd out loud. It was not absurd at the time.",
      },
      {
        type: "p",
        text: "The practical losses stack up too, and nobody counts them as part of the setback. The income. The house that had to go with it. The routine that held the week together, and the fact that nothing has replaced it.",
      },
      {
        type: "p",
        text: "Each one is small. Each one is real. And together they explain why the road gets steeper long after everyone assumed you were through the worst of it.",
      },
      {
        type: "quote",
        text: "The first loss was announced. These ones arrive quietly, and you meet them alone.",
      },
      {
        type: "p",
        text: "They are also unevenly spaced. Nothing for two months, then three in two weeks.",
      },
      { type: "h2", text: "Knowing It Is Coming" },
      {
        type: "p",
        text: "It helps enormously simply to know this is coming. Not to brace for it, but to recognize it when it arrives — to be able to say, that is another one, rather than, I am failing at this.",
      },
      {
        type: "p",
        text: "There is no way to inoculate yourself against them. But there is a real difference between being hit by something you have no name for and being hit by something you can name.",
      },
      {
        type: "p",
        text: "The first loss was announced. These ones arrive quietly, and you meet them alone.",
      },
      {
        type: "p",
        text: "It also means the support you need is not front-loaded. What most people need at eight months is exactly what everyone provided at week two, and by then it has largely gone.",
      },
      {
        type: "p",
        text: "If you are the friend of somebody in this — the useful thing is not the first two weeks. It is the message in month nine, on no particular occasion, saying you were thinking of them.",
      },
      {
        type: "p",
        text: "That is why month eight is hard. Not because you are going backwards. Because you are still discovering the size of what happened.",
      },
      {
        type: "p",
        text: "None of this means the earlier support was wasted. It only means a setback outlasts the arrangements everybody makes for it, by a considerable margin.",
      },
      {
        type: "closing",
        text: "When it gets heavier later, that is not a setback. It is the rest of the loss arriving — and it can be met one piece at a time.",
      },
    ],
  },
  {
    number: 4,
    slug: "a-setback-is-not-a-staircase",
    title: "A Setback Is Not a Staircase",
    subtitle:
      "Nobody moves through loss in a straight line. The line was never real.",
    seoTitle: "A Setback Is Not a Staircase | Bouncing Forward",
    seoDescription:
      "A real setback doesn’t climb through tidy stages — it swings. Your pace is the right pace, because it’s the one you’re actually walking.",
    heroImage: "/assets/blog/grief-is-not-a-staircase.png",
    blocks: [
      {
        type: "p",
        text: "Somewhere along the way we were handed the idea that a setback runs in stages. That you pass through them in order, one at a time, and arrive somewhere called acceptance.",
      },
      {
        type: "p",
        text: "You may even be able to name them. Most people can, roughly, and most people have privately checked their own progress against them at some point.",
      },
      {
        type: "p",
        text: "It is a tidy idea. It is also the reason so many people believe they are doing this wrong.",
      },
      { type: "h2", text: "It Swings, It Does Not Climb" },
      { type: "p", text: "Because a real setback does not climb. It swings." },
      {
        type: "p",
        text: "It also arrives out of order. Anger in month nine. Denial in year two, long after you thought that part was finished with.",
      },
      {
        type: "p",
        text: "And it repeats. You will accept something thoroughly, properly, with a real sense of having got somewhere. Then you will have to accept it again in June, and again the following spring, each time slightly differently.",
      },
      {
        type: "p",
        text: "You have a good week. A genuinely good one — you laugh at something, you sleep properly, you make a plan for August. And then Thursday arrives and puts you flat on the kitchen floor.",
      },
      {
        type: "p",
        text: "Nothing caused it. That is the part that unsettles people most — there is often no trigger to point at and no lesson to extract.",
      },
      {
        type: "image",
        text: "A good week, then Thursday. A setback keeps its own weather.",
      },
      { type: "h2", text: "The Day That Undoes the Week" },
      {
        type: "p",
        text: "By the staircase logic, you have fallen down three steps. You were at acceptance and now you are back at the bottom, and clearly something is wrong with you.",
      },
      {
        type: "p",
        text: "Nothing is wrong with you. That swinging is what a setback actually looks like from the inside.",
      },
      {
        type: "p",
        text: "Watch anyone in the middle of loss for a single day and you will see it. They handle the bank, the email, the school pick-up. They are entirely competent. Then they sit down in the car and do not move for twenty minutes.",
      },
      {
        type: "p",
        text: "Some hours you face the loss directly. Other hours you deal with the living — the admin, the school run, the work that will not wait. You move between the two all day, and both are necessary.",
      },
      {
        type: "p",
        text: "Doing only the first would be unbearable. Doing only the second would mean nothing is ever actually worked through. The swinging is not a malfunction; it is the mechanism.",
      },
      {
        type: "quote",
        text: "The swinging is not a malfunction. It is the mechanism.",
      },
      { type: "h2", text: "The Guilt of the Good Days" },
      {
        type: "p",
        text: "There is a particular guilt in the good days, and it deserves naming. Laughing properly for the first time. Realizing at nine at night that you have not thought about it since lunch.",
      },
      {
        type: "p",
        text: "The reverse guilt exists too. Being unable to function on a day everyone expected you to manage — a birthday, a christening, a Monday morning — and reading it as evidence that you are getting worse.",
      },
      {
        type: "p",
        text: "The days you function are not a betrayal. The days you cannot are not a collapse. They are the same process, seen from different hours.",
      },
      {
        type: "p",
        text: "That is not forgetting. It is the mind doing what it must to keep you alive, and it does not diminish anything.",
      },
      { type: "h2", text: "Nobody Is Behind" },
      {
        type: "p",
        text: "What the staircase does is give people a way to fail. It hands them a schedule they were never going to keep, and then makes them feel late.",
      },
      {
        type: "p",
        text: "It also gives everyone around you a way to assess you, which is arguably worse. People form quiet opinions about which stage you ought to have reached by now.",
      },
      {
        type: "p",
        text: "You are not late. There is no timetable. There is only your own pace, which is the correct one by definition.",
      },
      {
        type: "p",
        text: "People will suggest otherwise. Somebody will mention, gently, that it has been a while now. They mean well, and they are working from the same staircase you were handed.",
      },
      {
        type: "p",
        text: "You will also stop comparing your week to somebody else's, which is the other thing the staircase quietly encourages.",
      },
      {
        type: "p",
        text: "What tends to happen instead, over a long enough stretch, is that the bad days become less frequent and less total. They do not stop. They stop taking everything with them.",
      },
      {
        type: "p",
        text: "The most useful thing you can do with the staircase is put it down. It was never a description of a setback — only a hope that a setback would behave.",
      },
      {
        type: "p",
        text: "It does not behave. But it does move, in its own uneven way, and so do you.",
      },
      {
        type: "closing",
        text: "Stop measuring your setback against a schedule it never agreed to. Your pace is the right pace, because it is the one you are actually walking.",
      },
    ],
  },
  {
    number: 5,
    slug: "the-friends-who-disappeared",
    title: "The Friends Who Disappeared",
    subtitle:
      "Loss quietly rearranges everyone around you, and nobody warns you it is coming.",
    seoTitle: "The Friends Who Disappeared | Bouncing Forward",
    seoDescription:
      "Loss rearranges everyone around you. Why people vanish, who surprises you, and the quiet power of asking for one specific thing.",
    heroImage: "/assets/blog/the-friends-who-disappeared.png",
    blocks: [
      {
        type: "p",
        text: "Nobody prepares you for this part. Loss does not only take the thing you lost. It reorganizes every relationship you have.",
      },
      {
        type: "p",
        text: "It is one of the losses inside the loss, and it frequently hurts more than people expect, arriving as it does when there is least capacity to absorb it.",
      },
      {
        type: "p",
        text: "Somebody you counted on for fifteen years goes quiet. Not cruelly — they just become slightly busy, slightly hard to pin down, and then they are simply not there.",
      },
      {
        type: "p",
        text: "You will replay it, trying to identify the moment it went wrong. There usually is not one.",
      },
      { type: "h2", text: "The Ones Who Surprised You" },
      {
        type: "p",
        text: "Meanwhile a colleague you barely knew keeps checking in. A neighbor leaves soup on the step every Sunday for a month without ever asking to come in.",
      },
      {
        type: "p",
        text: "The unexpected arrivals are worth paying attention to. They are often people who have been through something themselves, and who therefore know that showing up badly beats not showing up.",
      },
      {
        type: "p",
        text: "There is a rearranging of who you are close to, and it happens without anyone deciding. A year on, your list of people is simply different from the one you had before, and it is usually a truer list.",
      },
      {
        type: "image",
        text: "Soup on a doorstep. The people who arrive are rarely the ones you expected.",
      },
      {
        type: "p",
        text: "It is one of the strangest features of a setback: the people you expected to arrive often don't, and the people who do arrive are frequently a surprise.",
      },
      { type: "h2", text: "Why People Vanish" },
      {
        type: "p",
        text: "The disappearing is worth understanding, because most people take it as a verdict on themselves.",
      },
      {
        type: "p",
        text: "It usually isn't. People vanish because they are frightened of saying the wrong thing, so they say nothing, and then the silence gets embarrassing and grows longer. Some are frightened of your setback because it reminds them of one of their own.",
      },
      {
        type: "p",
        text: "They assume they have been judged and found insufficient at the exact moment they needed people most.",
      },
      {
        type: "p",
        text: "Some disappear because they came to the funeral and considered the matter dealt with. They were sincerely sorry in March and have not thought about it since, because for them it was an event rather than a life.",
      },
      {
        type: "p",
        text: "None of this is your failure. It is their limit, arriving at the worst possible moment.",
      },
      {
        type: "quote",
        text: "None of this is your failure. It is their limit, arriving at the worst possible moment.",
      },
      {
        type: "p",
        text: "It is also worth knowing that some friendships end simply because they had been running on shared circumstances rather than anything deeper, and the loss removed the circumstances.",
      },
      { type: "h2", text: "When They Help Badly" },
      {
        type: "p",
        text: "There is also the matter of how badly people help. They say things that land like a slap — at least it was quick, everything happens for a reason, you're so strong.",
      },
      {
        type: "p",
        text: "Almost all of it is aimed clumsily at kindness. It is worth trying, where you can, to receive the intention rather than judging the execution. People who love you are also navigating something they do not know how to handle.",
      },
      {
        type: "p",
        text: "That said, you are not obliged to absorb everything. If somebody keeps arriving with advice you did not ask for, you are allowed to see less of them for a while. A setback is a bad time to be managing other people.",
      },
      {
        type: "p",
        text: "There is also the person who wants to talk about their own loss every time you mention yours. Occasionally that is a comfort. Frequently it is a conversation you have to run, and you do not have the staff for it.",
      },
      { type: "h2", text: "Ask for Something Specific" },
      {
        type: "p",
        text: "The other half of this is harder, because it belongs to you. People genuinely do not know what you need, and most will not guess correctly.",
      },
      {
        type: "p",
        text: "So ask for something specific. Not help in general — a Tuesday evening. A ride on Thursday. Somebody to sit in the room while you make the phone call you have been avoiding for two weeks.",
      },
      {
        type: "p",
        text: "Specific requests are easy to say yes to. Vague ones are easy to miss.",
      },
      {
        type: "p",
        text: "It feels like an imposition. It is not — it is a relief, because it converts a vague and frightening situation into a task they can actually complete.",
      },
      {
        type: "p",
        text: "People are also more willing than you think. Most of them have been standing at a distance wanting to help, worried that offering would be intruding, waiting for a signal they never received.",
      },
      { type: "h2", text: "Notice Who Stays" },
      {
        type: "p",
        text: "And notice who stays. Not who said the right thing at the funeral — who is still there in March. That is your real list, and it is usually different from the one you would have written a year ago.",
      },
      {
        type: "p",
        text: "Tell them, if you can. People who show up quietly rarely know it registered. A short message saying that you noticed, and that it mattered, is one of the few things in all of this that costs nothing and lands enormously.",
      },
      {
        type: "closing",
        text: "Ask one person for one specific thing this week. It is a smaller ask than it feels, and most people are waiting to be told how.",
      },
    ],
  },
  {
    number: 6,
    slug: "you-do-not-have-to-let-go",
    title: "You Do Not Have to Let Go",
    subtitle:
      "The advice to move on has confused more people than it has ever helped.",
    seoTitle: "You Do Not Have to Let Go | Bouncing Forward",
    seoDescription:
      "“Move on” is the advice that keeps people stuck. You were never asked to choose between keeping them and going forward.",
    heroImage: "/assets/blog/you-do-not-have-to-let-go.png",
    blocks: [
      {
        type: "p",
        text: "At some point, someone will suggest that it is time to let go. To move on. To close that chapter and begin the next one.",
      },
      {
        type: "p",
        text: "It often arrives with a timescale attached, which makes it worse. A year is usually mentioned, as though the setback had been consulted about the calendar.",
      },
      {
        type: "p",
        text: "It is meant kindly. It is also the single idea that keeps more people stuck than any other.",
      },
      { type: "h2", text: "THE FEAR UNDERNEATH IT" },
      {
        type: "p",
        text: "There is a fear underneath it that people rarely say out loud: that moving forward will slowly erase them. That the details will go, and one day you will not remember exactly how they sounded.",
      },
      {
        type: "p",
        text: "That fear is worth answering directly. Some details do fade — the exact voice, the particular laugh. What tends to remain is more durable: what they would have thought, how they would have handled this, what they found funny.",
      },
      {
        type: "p",
        text: "Because it presents an impossible choice: keep them, or move forward. And faced with that choice, most people quite rightly refuse to move at all.",
      },
      { type: "h2", text: "A FALSE CHOICE" },
      {
        type: "p",
        text: "The good news is that it was always a false choice.",
      },
      {
        type: "p",
        text: "People who are living well after loss have not let go of anything. They have simply changed where they carry it. The relationship has moved from the phone to somewhere internal, and it continues.",
      },
      {
        type: "p",
        text: "Watch anyone a decade past a significant loss and you will see this immediately, though they may never have described it to anyone.",
      },
      {
        type: "quote",
        text: "They have not let go of anything. They have changed where they carry it.",
      },
      {
        type: "p",
        text: "They still talk to them. In the car, in the garden, at three in the morning. They ask what they would have made of something and they know, with reasonable accuracy, what the answer would be.",
      },
      {
        type: "p",
        text: "They consult them about decisions. They notice things specifically because that person would have liked them.",
      },
      {
        type: "p",
        text: "They cook their food. They use their phrases without meaning to and hear their voice come out of their own mouth. They keep the sweater in the drawer, and they are not sentimental about it — it is simply where it lives now.",
      },
      {
        type: "image",
        text: "A sweater still in the drawer. Not a shrine — simply where it lives now.",
      },
      {
        type: "p",
        text: "Some keep a habit going. The garden they planted. The charity they cared about. The Sunday walk, done alone now, on the same route.",
      },
      { type: "h2", text: "WHERE IT DOES KEEP PEOPLE STUCK" },
      {
        type: "p",
        text: "None of this is being stuck. This is what carrying somebody forward actually looks like from the inside.",
      },
      {
        type: "p",
        text: "There is a version that does keep people stuck, and it is worth being honest about. It looks like a life arranged entirely around the absence — no new rooms, no new people, everything preserved exactly.",
      },
      {
        type: "p",
        text: "The difference is not whether you keep them. It is whether keeping them has become the only thing you do.",
      },
      {
        type: "p",
        text: "The room left exactly as it was is not a shrine to denial. It can be the opposite — a monument to acceptance. It says: this happened, it was real, it mattered, and I am not going to rearrange the furniture of their memory as though they never existed.",
      },
      {
        type: "p",
        text: "The reverse is equally fine. Some people clear everything within two weeks, and that is not coldness — it is simply a different way of carrying the same thing.",
      },
      { type: "h2", text: "LOSSES THAT WERE NOT PEOPLE" },
      {
        type: "p",
        text: "The same is true of losses that were not people. You do not have to pretend the career, or the marriage, or the health you had never happened in order to build what comes next.",
      },
      {
        type: "p",
        text: "The years you gave to the marriage still happened. The work you did in the career still counts. None of it has to be disowned for the next part to begin.",
      },
      {
        type: "p",
        text: "So take moving on and set it down. It is the wrong instruction and it has never once worked.",
      },
      {
        type: "p",
        text: "Nobody who has genuinely done this describes it as letting go. They describe it as learning where to put something.",
      },
      {
        type: "p",
        text: "You will also find that other people have their own ideas about the correct amount of remembering, and will occasionally share them. Their timetable is not yours, and they are not the ones carrying it.",
      },
      {
        type: "p",
        text: "What is actually being asked of you is far more reasonable. Not to leave them behind — to bring them with you, in whatever form they can travel now.",
      },
      {
        type: "p",
        text: "That is a far more manageable instruction, and unlike the other one, it is possible.",
      },
      {
        type: "closing",
        text: "You were never asked to choose between keeping them and going forward. You are allowed to do both, and most people who make it through do exactly that.",
      },
    ],
  },
  {
    number: 7,
    slug: "this-will-make-you-stronger",
    title: "When People Say This Will Make You Stronger",
    subtitle:
      "Something can grow out of loss. It is not owed, and it is never the point.",
    seoTitle: "When People Say This Will Make You Stronger | Bouncing Forward",
    seoDescription:
      "Something can grow out of loss — but growth is not the entrance fee for recovery, and it is never the reason it happened.",
    heroImage: "/assets/blog/this-will-make-you-stronger.png",
    blocks: [
      {
        type: "p",
        text: "Somebody will say it, usually early, usually with real warmth. This will make you stronger. You'll come out of this a better person. One day you'll see why this happened.",
      },
      {
        type: "p",
        text: "It is often said by people who have not been through anything comparable, which is not a criticism so much as an explanation.",
      },
      {
        type: "p",
        text: "It is almost always meant well. It almost always lands badly.",
      },
      { type: "h2", text: "Why It Lands Badly" },
      {
        type: "p",
        text: "Because it arrives as a kind of instruction. It suggests that your job now, on top of everything else, is to produce something worthwhile from the worst thing that ever happened to you.",
      },
      {
        type: "p",
        text: "Because in the moment it is said, you do not want to be stronger. You want things to be as they were, and the suggestion that this is an opportunity can feel like an insult dressed as encouragement.",
      },
      {
        type: "p",
        text: "And if you have not produced it yet, you are behind on that too.",
      },
      {
        type: "p",
        text: "There is a particular pressure in being told you are strong. It sounds like praise, and it functions like a job description — because the moment you stop being strong, you are letting somebody down.",
      },
      { type: "h2", text: "The More Honest Version" },
      {
        type: "p",
        text: "Here is the more honest version. Something does often grow out of loss. People come out of it with a clarity about what matters that they never had before. They stop spending time on things they had spent decades tolerating.",
      },
      {
        type: "p",
        text: "It rarely looks like the version in the phrase. Nobody emerges from loss as an improved and inspiring person. They emerge tired, changed in specific ways, and considerably clearer about what they will and will not spend time on.",
      },
      {
        type: "p",
        text: "They become noticeably better in a room with someone else's pain, because they have stopped needing to fix it.",
      },
      {
        type: "p",
        text: "They get better at saying no. They stop attending things out of obligation. They become slightly less frightened of most of what used to frighten them, having already survived the thing they feared most.",
      },
      {
        type: "p",
        text: "They also become harder to impress and easier to be around. Small talk gets shorter. The things that used to keep them awake at two in the morning are revealed as not very important.",
      },
      {
        type: "image",
        text: "Clarity is the usual souvenir — arriving quietly, mostly in hindsight.",
      },
      { type: "h2", text: "It Is Not Payment Received" },
      {
        type: "p",
        text: "But — and this matters more than the rest of it — that growth is never the reason it happened. It does not balance anything. It is not payment received.",
      },
      {
        type: "p",
        text: "The suggestion that it happened for a reason is the one worth refusing outright. It asks you to accept that something good required your loss as payment, and almost nobody who has actually been through it believes that.",
      },
      {
        type: "p",
        text: "It is simply what some people find on the other side, having been sent there against their will.",
      },
      { type: "quote", text: "Growth is not the entrance fee for recovery." },
      {
        type: "p",
        text: "And plenty of people find nothing at all, and go on to live good lives regardless. Growth is not the entrance fee for recovery.",
      },
      {
        type: "p",
        text: "You are allowed to want none of it. You are allowed to say that you would return every scrap of hard-won wisdom tomorrow to have things as they were, and mean it completely.",
      },
      {
        type: "p",
        text: "And you are allowed to find no meaning at all. Some things are simply loss, with nothing redemptive attached, and refusing to manufacture a silver lining is an honest position rather than a bitter one.",
      },
      { type: "h2", text: "Let It Arrive in Its Own Time" },
      {
        type: "p",
        text: "The pressure to find the meaning quickly is worth resisting. Rushing to the lesson is often a way of stepping over the setback rather than through it, and there is no prize for recovering faster than is honest.",
      },
      {
        type: "p",
        text: "There is also a difference between meaning you find and meaning you are handed. The first arrives on its own, usually late, and fits. The second is somebody else's comfort, offered to you to hold.",
      },
      {
        type: "p",
        text: "If something does grow, it will arrive quietly and mostly in hindsight. You will notice, months later, that you handled something differently.",
      },
      {
        type: "p",
        text: "You will catch yourself being patient with somebody in a way the old version of you would not have been. That is the shape it usually takes — not a transformation, a small adjustment noticed late.",
      },
      {
        type: "p",
        text: "Nobody will congratulate you. It will not feel like triumph. It will feel like being slightly more yourself than you were, carrying something you never wanted.",
      },
      {
        type: "p",
        text: "And on the days when none of it feels like growth — when it feels only like damage — that is allowed to be the honest report. Both accounts can be true of the same year.",
      },
      {
        type: "closing",
        text: "Nothing is owed. If something grows from this, let it arrive in its own time — and let it be yours, rather than something demanded of you.",
      },
    ],
  },
  {
    number: 8,
    slug: "someone-who-has-been-through-something",
    title: "Becoming Someone Who Has Been Through Something",
    subtitle:
      "Not recovery. Not closure. Something quieter, and considerably more useful.",
    seoTitle: "Becoming Someone Who Has Been Through Something",
    seoDescription:
      "Not recovery, not closure — something quieter. The loss becomes load-bearing, and you become someone with something to offer.",
    heroImage: "/assets/blog/someone-who-has-been-through-something.png",
    blocks: [
      {
        type: "p",
        text: "There is a word people keep reaching for, and it does not fit. Closure.",
      },
      {
        type: "p",
        text: "People will use it kindly and often. They will ask whether you have found any, as though it were a set of keys.",
      },
      {
        type: "p",
        text: "It suggests a door that shuts, and a room you never enter again. That is not what happens, and waiting for it is a long wait for nothing.",
      },
      { type: "h2", text: "The Word That Does Not Fit" },
      {
        type: "p",
        text: "What actually happens is harder to name and much better.",
      },
      {
        type: "p",
        text: "People describe it differently. Learning to carry it. Making room for it. Building the rest of the house around it. None of them are quite right, but they are all pointing at the same thing.",
      },
      {
        type: "p",
        text: "The loss stops being the whole building and becomes part of the structure. It is still there — load-bearing, permanent, visible if you know where to look. But there are other rooms now, and you spend time in them.",
      },
      {
        type: "p",
        text: "This takes considerably longer than anyone suggests, and it does not happen on a schedule. But it happens to most people who keep going, including the ones who were certain it would not happen to them.",
      },
      { type: "h2", text: "What Comes Back" },
      {
        type: "p",
        text: "You can say their name in a full room without your voice going. You can tell a funny story about them and laugh at it properly, and the laugh is not a betrayal of anything.",
      },
      {
        type: "p",
        text: "You will notice small returns. Music becoming enjoyable again rather than dangerous. Wanting to cook something properly. Making a plan for next year and meaning it.",
      },
      {
        type: "p",
        text: "You still have days that take you apart. They are further apart now, and you recognize them when they arrive.",
      },
      {
        type: "p",
        text: "A song, a season, a stretch of weather that is too similar to a particular week. You will know, by then, that it will pass by Thursday.",
      },
      {
        type: "p",
        text: "You get better at spotting them coming, and at clearing the afternoon rather than fighting through it. That is not resignation. It is knowing your own weather.",
      },
      {
        type: "image",
        text: "Other rooms in the same house. The loss is load-bearing, not the whole building.",
      },
      { type: "h2", text: "Not Over It — Carrying It" },
      {
        type: "p",
        text: "This is not the same as being over it. You will not be over it, in the way that word suggests, and that is not a failure — it is simply what it means to have loved something enough to mourn it.",
      },
      {
        type: "p",
        text: "The aim was never to stop feeling it. The aim was for it to stop being the only thing you feel.",
      },
      {
        type: "p",
        text: "What you become instead is a person who has been through something. And that turns out to be a specific and recognizable kind of person.",
      },
      {
        type: "p",
        text: "It is not a title anyone wants. But it is one of the few things loss hands over that is genuinely worth having, and you cannot get it any other way.",
      },
      { type: "h2", text: "The Kind of Person You Become" },
      {
        type: "p",
        text: "They are unhurried around other people's pain. They do not offer bright solutions or tell anyone that everything happens for a reason. They can sit with somebody in a bad hour without needing the hour to improve.",
      },
      {
        type: "p",
        text: "They ask better questions. They do not flinch when somebody says the word died. They know that the useful thing is usually presence rather than words, because that is what worked on them.",
      },
      {
        type: "p",
        text: "You will find that people begin to come to you. Not because you have answers — because you are not frightened of the subject, and almost everyone else is.",
      },
      {
        type: "p",
        text: "You may find, eventually, that being useful to somebody earlier on the road is one of the few things that makes any of it bearable. Not a reason for what happened. A use for what it left you with.",
      },
      {
        type: "p",
        text: "That is what the crossing gives you, and it is the only part of it worth having. Not a reason for what happened. A capacity you did not have before.",
      },
      {
        type: "quote",
        text: "Not a reason for what happened. A capacity you did not have before.",
      },
      {
        type: "p",
        text: "It also changes what you notice. People carrying something become visible to you — in a waiting room, at a desk, in the way somebody answers a simple question slightly too quickly.",
      },
      {
        type: "p",
        text: "You will not go back to who you were before. That person is gone, and you are allowed to miss them too.",
      },
      {
        type: "p",
        text: "There was a lightness that person had, and it is fair to mourn them alongside everything else. Very few people mention this, and almost everyone feels it.",
      },
      {
        type: "p",
        text: "But forward is not the same as back, and it was always the only direction available. It leads somewhere — to who you are once you have crossed it.",
      },
      {
        type: "closing",
        text: "You are not aiming for the person you were. You are becoming the one who has been through it — and that person has something to offer.",
      },
    ],
  },
  {
    number: 9,
    slug: "the-story-you-tell",
    title: "The Story You Tell About What Happened",
    subtitle:
      "The facts of a setback are fixed. The story you build around them is still being written.",
    seoTitle: "The Story You Tell About What Happened | Bouncing Forward",
    seoDescription:
      "The facts of a setback are fixed. The story you build around them is not. How to separate the two and write a fairer account that points you forward.",
    keywords: [
      "setback",
      "reframing a setback",
      "self-talk after a setback",
      "learning from setbacks",
      "moving forward",
      "resilience",
    ],
    publishOn: "2026-10-09",
    blocks: [
      {
        type: "p",
        text: "Every setback comes with two things. What happened, and the story you tell yourself about what happened.",
      },
      {
        type: "p",
        text: "The first part is fixed. The job ended. The relationship finished. The plan fell through. Those facts are not going anywhere.",
      },
      {
        type: "p",
        text: "The second part is far more flexible than it feels. And more often than not, it is the story, not the facts, that decides how long you stay stuck.",
      },
      {
        type: "h2",
        text: "The Story Arrives First",
      },
      {
        type: "p",
        text: "Think about the first few days after a setback. Before you have had time to think anything through, a story has already formed.",
      },
      {
        type: "p",
        text: "It usually sounds something like this. I should have seen it coming. This always happens to me. I am too old to start again. Nobody will want me now.",
      },
      {
        type: "p",
        text: "These stories arrive quickly because the mind hates a gap. It wants an explanation, any explanation, and it grabs the nearest one. The trouble is that the nearest one is usually the harshest.",
      },
      {
        type: "p",
        text: "Left unchecked, that first draft quietly hardens into the official version. You repeat it to yourself until it stops feeling like a story at all and starts feeling like the truth.",
      },
      {
        type: "h2",
        text: "Facts and Interpretations",
      },
      {
        type: "p",
        text: "Here is a useful exercise. Take the story you have been telling and sort it into two piles.",
      },
      {
        type: "p",
        text: "In the first pile, put only the facts. What actually happened, the way a camera would have recorded it.",
      },
      {
        type: "p",
        text: "In the second pile, put everything else. The conclusions, the predictions, the judgments about what it says about you.",
      },
      {
        type: "p",
        text: 'Most people are surprised by how small the first pile is, and how big the second one has grown. "The company restructured and my role was cut" is a fact. "I am clearly not good enough" is an interpretation. They feel like the same thing. They are not.',
      },
      {
        type: "quote",
        text: "The facts of a setback are fixed. The meaning you give them is still open.",
      },
      {
        type: "h2",
        text: "Looking Back to Learn",
      },
      {
        type: "p",
        text: "This is not about pretending things were better than they were, or spinning a setback into something cheerful. A story that ignores what hurt is just as unhelpful as one that blames you for everything.",
      },
      {
        type: "p",
        text: "The aim is a fairer account. One that asks what you can learn rather than what you did wrong.",
      },
      {
        type: "p",
        text: "What did this teach me about what I value? What would I do differently, and what would I do exactly the same? What did I handle better than I gave myself credit for at the time?",
      },
      {
        type: "p",
        text: "Those questions look backward, but they point forward. They turn the setback from a verdict into a source of information you can actually use.",
      },
      {
        type: "h2",
        text: "Writing the Next Chapter",
      },
      {
        type: "p",
        text: "Once you see that the story is yours to shape, something shifts. You stop being only the person this happened to. You become the person deciding what it means.",
      },
      {
        type: "p",
        text: "That is a glorious amount of power to get back.",
      },
      {
        type: "p",
        text: "Perhaps the new version sounds like this. That chapter ended, and it taught me what I need from the next one. Or, I came through something hard, and I know more about myself because of it.",
      },
      {
        type: "p",
        text: "Neither of those denies what happened. Both of them leave the door open.",
      },
      {
        type: "p",
        text: "So here is something worth mulling over. If someone you cared about told you the story you have been telling yourself, would you let them keep it? Or would you help them write a fairer one?",
      },
      {
        type: "p",
        text: "You deserve the same help. Start with the facts, question the rest, and keep the pen in your own hand.",
      },
      {
        type: "closing",
        text: "Setbacks don't get the last word.",
      },
    ],
  },
  {
    number: 10,
    slug: "acceptance-is-not-agreeing",
    title: "Acceptance Is Not Agreeing It Was Fair",
    subtitle:
      "You can accept what happened and still believe it should never have happened at all.",
    seoTitle: "Acceptance Is Not Agreeing It Was Fair | Bouncing Forward",
    seoDescription:
      "Accepting a setback is not approving of it. Why acceptance carries no verdict on fairness, and how it gives you solid ground to decide what comes next.",
    keywords: [
      "acceptance",
      "accepting a setback",
      "unfairness",
      "letting go of resistance",
      "moving forward",
      "resilience",
    ],
    publishOn: "2026-10-16",
    blocks: [
      {
        type: "p",
        text: "Few words cause more resistance after a setback than this one. Acceptance.",
      },
      {
        type: "p",
        text: "Someone suggests it, usually kindly, and something in you digs in its heels. Accept it? Accept being let go after eleven years of loyalty? Accept the diagnosis, the betrayal, the business that collapsed through no fault of yours?",
      },
      {
        type: "p",
        text: "The resistance makes complete sense. Because somewhere along the way, acceptance got tangled up with approval. And nobody should be asked to approve of something that hurt them.",
      },
      {
        type: "h2",
        text: "The Mix-Up at the Heart of It",
      },
      {
        type: "p",
        text: 'Here is the muddle. Many people hear "accept it" as "agree that it was fine." Or "stop being upset about it." Or, worst of all, "admit you deserved it."',
      },
      {
        type: "p",
        text: "None of those is acceptance.",
      },
      {
        type: "p",
        text: "Acceptance is simply acknowledging what is true right now. This happened. This is where I am. These are the facts I am working with.",
      },
      {
        type: "p",
        text: "That is all. It carries no verdict about whether it was fair. It asks for no forgiveness. It does not require you to like a single thing about it.",
      },
      {
        type: "h2",
        text: "Why Refusing Feels Like Loyalty",
      },
      {
        type: "p",
        text: "Think about why holding out feels so important. Refusing to accept a setback can feel like protecting something: your sense of justice, your dignity, the version of events in which this was wrong.",
      },
      {
        type: "p",
        text: "It is as though accepting it would let the unfairness off the hook.",
      },
      {
        type: "p",
        text: "But the harsh reality is that refusing to accept what happened does not undo it. It only keeps you standing at the scene, arguing with something that has already left.",
      },
      {
        type: "p",
        text: "Meanwhile, your energy goes into the argument rather than into what comes next.",
      },
      {
        type: "quote",
        text: "Acceptance carries no verdict about whether it was fair. It only tells you where you are standing.",
      },
      {
        type: "h2",
        text: "What Acceptance Makes Possible",
      },
      {
        type: "p",
        text: "Think of acceptance as reading the map before you set out. You cannot plan a route from a place you refuse to admit you are standing in.",
      },
      {
        type: "p",
        text: 'Once you can say "this is where I am," a whole set of useful questions opens up. What do I still have? What can I change? What is mine to deal with, and what belongs to someone else?',
      },
      {
        type: "p",
        text: "Those questions are unavailable to someone still insisting it cannot be true.",
      },
      {
        type: "p",
        text: "People often describe the moment of acceptance as a surprising relief. Not because the situation improved, but because they stopped spending every day pushing against a closed door. The effort that went into resisting is suddenly free for something more useful.",
      },
      {
        type: "h2",
        text: "Holding Both at Once",
      },
      {
        type: "p",
        text: "The most freeing discovery is that acceptance and a sense of injustice can live side by side.",
      },
      {
        type: "p",
        text: "You can say: this was unfair, and it happened. I wish it had gone differently, and here I am. Someone let me down, and I am deciding what to do next.",
      },
      {
        type: "p",
        text: "Both halves of each sentence are true. Neither cancels the other.",
      },
      {
        type: "p",
        text: "You might find, perhaps, that once you stop needing acceptance to mean approval, it becomes much easier to reach. It was never asking you to surrender your view of what happened. It was only asking you to stand on solid ground while you decide where to go.",
      },
      {
        type: "p",
        text: "When all is said and done, acceptance is not the end of your story about the setback. It is the beginning of your story after it.",
      },
      {
        type: "closing",
        text: "Setbacks don't get the last word.",
      },
    ],
  },
  {
    number: 11,
    slug: "when-everyone-else-has-moved-on",
    title: "When Everyone Else Has Moved On",
    subtitle:
      "Their timeline was never yours to keep. Yours is allowed to run at its own pace.",
    seoTitle: "When Everyone Else Has Moved On | Bouncing Forward",
    seoDescription:
      "When the calls thin out and everyone else has moved on, it is easy to feel left behind. How to stop borrowing their timeline and set your own pace.",
    keywords: [
      "feeling left behind",
      "support after a setback",
      "comparing yourself",
      "your own pace",
      "moving forward",
      "resilience",
    ],
    publishOn: "2026-10-23",
    blocks: [
      {
        type: "p",
        text: "At first, people show up. They call, they check in, they ask how you are and wait for the real answer.",
      },
      {
        type: "p",
        text: "Then, gradually, life pulls them back to their own concerns. The calls thin out. The questions get lighter. Conversations drift to holidays and work and whatever is happening in the news.",
      },
      {
        type: "p",
        text: "And you are left with the odd sensation of standing still while the world around you has quietly started walking again.",
      },
      {
        type: "h2",
        text: "This Is Not a Sign That They Stopped Caring",
      },
      {
        type: "p",
        text: "It is tempting to read the silence as indifference. More often than not, it is something far more ordinary.",
      },
      {
        type: "p",
        text: "Most people simply do not know how long a setback lasts. They assume the hard part is the first few weeks, because that is where all the drama sits. They have no idea that the real work often begins once the noise dies down.",
      },
      {
        type: "p",
        text: "Others worry that raising it will reopen something. So they stay quiet, believing they are being kind.",
      },
      {
        type: "p",
        text: "Neither of these is abandonment. It is a gap in understanding, and it is far more common than anyone admits.",
      },
      {
        type: "h2",
        text: "The Comparison That Keeps You Stuck",
      },
      {
        type: "p",
        text: "The harder part is what happens inside your own head. When everyone else has moved on, it is very easy to start asking what is wrong with you.",
      },
      {
        type: "p",
        text: "Shouldn't I be past this by now? Why can they talk about it so casually when I still cannot?",
      },
      {
        type: "p",
        text: "This is a comparison with no fair basis. They were standing near the setback. You were standing in it. Of course you are moving at a different pace. You are carrying a different load.",
      },
      {
        type: "p",
        text: "Measuring yourself against their timeline is like comparing your journey with a passenger who got off three stops ago.",
      },
      {
        type: "quote",
        text: "They were standing near the setback. You were standing in it.",
      },
      {
        type: "h2",
        text: "Setting Your Own Pace",
      },
      {
        type: "p",
        text: "So what helps, when you are no longer in step with the people around you?",
      },
      {
        type: "p",
        text: "Start by giving yourself permission to be exactly where you are. Progress after a setback is real, but it is rarely visible from the outside, and it is never on anyone else's schedule.",
      },
      {
        type: "p",
        text: "Then, notice your own markers rather than borrowing theirs. Perhaps you got through a whole morning without the familiar heaviness. Perhaps you made a decision you had been avoiding. Perhaps you laughed and meant it. These are the signposts that actually matter, and only you can see them.",
      },
      {
        type: "p",
        text: 'It can also help to tell one or two people plainly where you are. Not as a complaint, simply as information. "I\'m still finding my feet with this. It would help if you asked now and then." Most people are relieved to be told what is useful.',
      },
      {
        type: "h2",
        text: "Moving On Versus Moving Forward",
      },
      {
        type: "p",
        text: "There is an important difference hiding in all of this.",
      },
      {
        type: "p",
        text: "The people around you have moved on, which means they have turned their attention elsewhere. That is natural, and it is fine.",
      },
      {
        type: "p",
        text: "Your task is different. You are not trying to move on, as if the setback could be stepped over and left behind. You are moving forward, which means taking what happened with you and building something from it.",
      },
      {
        type: "p",
        text: "That takes longer. It is supposed to. And when you get there, you will have something they do not: the hard-won steadiness of someone who went through it at their own pace and came out sure-footed.",
      },
      {
        type: "closing",
        text: "Setbacks don't get the last word.",
      },
    ],
  },
  {
    number: 12,
    slug: "small-decisions-rebuild-confidence",
    title: "The Small Decisions That Rebuild Your Confidence",
    subtitle:
      "When the big choices feel impossible, the small ones quietly do the rebuilding.",
    seoTitle:
      "The Small Decisions That Rebuild Your Confidence | Bouncing Forward",
    seoDescription:
      "A setback shakes your trust in your own judgment. How small, low-stakes decisions quietly rebuild confidence until the big choices feel manageable.",
    keywords: [
      "confidence after a setback",
      "decision making",
      "self-trust",
      "small steps",
      "moving forward",
      "resilience",
    ],
    publishOn: "2026-10-30",
    blocks: [
      {
        type: "p",
        text: "One of the least talked-about effects of a setback is what it does to your trust in yourself.",
      },
      {
        type: "p",
        text: "You made choices that led here, or you failed to see it coming, or you simply could not stop it. Whatever the story, a little voice starts asking whether your judgment can still be relied on.",
      },
      {
        type: "p",
        text: "Consequently, decisions that used to take seconds start to take days. Which job to apply for. Whether to sell the house. What to say to the people involved. Even what to cook tonight can feel strangely heavy.",
      },
      {
        type: "h2",
        text: "Why Big Decisions Freeze Us",
      },
      {
        type: "p",
        text: "After a setback, the stakes of every choice seem higher. You have just seen how badly things can go, and you are understandably reluctant to risk it again.",
      },
      {
        type: "p",
        text: "So the big decisions pile up. And the longer they wait, the bigger they look.",
      },
      {
        type: "p",
        text: "This is not weakness. It is a perfectly sensible response to having had the ground move under you. But left alone, it can turn into a kind of paralysis, where waiting feels safer than choosing, and the waiting itself becomes the problem.",
      },
      {
        type: "h2",
        text: "Confidence Is Built, Not Found",
      },
      {
        type: "p",
        text: "Here is something worth knowing. Confidence rarely returns all at once, in a single moment of clarity. It is rebuilt, one small decision at a time.",
      },
      {
        type: "p",
        text: "Every time you make a choice and see it through, you gather a little evidence that your judgment still works. Every small piece of evidence makes the next decision slightly easier.",
      },
      {
        type: "p",
        text: "The good news is that the decisions do not have to be big to count. In fact, the smaller and lower-stakes they are, the better they work as building material.",
      },
      {
        type: "quote",
        text: "Every choice you see through is a small piece of evidence that your judgment still works.",
      },
      {
        type: "h2",
        text: "What Small Decisions Look Like",
      },
      {
        type: "p",
        text: "Think about the choices sitting just within reach. Not the life-changing ones. The ones you could make today.",
      },
      {
        type: "p",
        text: "Replying to the message you have been putting off. Deciding which one thing you will deal with this week and letting the rest wait. Choosing to say yes to a coffee, or no to an obligation that drains you. Clearing one drawer, one inbox, one corner of the mess.",
      },
      {
        type: "p",
        text: "None of these will change your life on its own. That is precisely the point. They are small enough to get right, and getting them right is what rebuilds the muscle.",
      },
      {
        type: "p",
        text: "It helps to notice them, too. At the end of a day, ask yourself what you decided and followed through on. You will often find more than you expected.",
      },
      {
        type: "h2",
        text: "From Small to Sure-Footed",
      },
      {
        type: "p",
        text: "Something shifts as the small decisions add up. The voice that questioned your judgment gets quieter, not because someone argued it down, but because you kept quietly proving it wrong.",
      },
      {
        type: "p",
        text: "At some point, the bigger decision that felt impossible a few months ago starts to look manageable. Not easy, but manageable. You have a track record now, however modest, and it carries weight.",
      },
      {
        type: "p",
        text: "This is how most people move forward after a setback. Not with one bold leap, but with a series of small, sure-footed steps that eventually add up to a new direction.",
      },
      {
        type: "p",
        text: "So if a big decision is waiting and you cannot face it yet, that is fine. Make a small one instead. Then another. You are building the confidence you will need when the big one's time comes.",
      },
      {
        type: "closing",
        text: "Setbacks don't get the last word.",
      },
    ],
  },
  {
    number: 13,
    slug: "what-do-you-want-now",
    title: "What Do You Want Now That the Old Plan Is Gone?",
    subtitle:
      "A setback clears the page. That is unsettling, and it is also an invitation.",
    seoTitle:
      "What Do You Want Now That the Old Plan Is Gone? | Bouncing Forward",
    seoDescription:
      "When the old plan falls apart, the question of what you want comes back. Simple prompts to start wanting again, and why a sketch beats a blueprint.",
    keywords: [
      "starting over",
      "new goals",
      "life after a setback",
      "what do I want",
      "imagining a new future",
      "resilience",
    ],
    publishOn: "2026-11-06",
    blocks: [
      {
        type: "p",
        text: "Most of us have not asked ourselves what we want in a very long time.",
      },
      {
        type: "p",
        text: "We asked once, years ago. We made a plan. Then we got busy following it. The career path, the relationship, the house, the retirement date. The plan did the wanting for us, and we simply kept walking.",
      },
      {
        type: "p",
        text: "Then a setback arrives and the plan falls apart. Suddenly the question we stopped asking is standing right in front of us again. And many people find, to their surprise, that they have no idea how to answer it.",
      },
      {
        type: "h2",
        text: "Why the Question Feels So Hard",
      },
      {
        type: "p",
        text: "Part of the difficulty is practice. Wanting is a skill, and like any skill, it gets rusty when it is not used.",
      },
      {
        type: "p",
        text: "Another part is fear. After a setback, wanting something feels risky. You have just seen how quickly plans can collapse. Why build another one?",
      },
      {
        type: "p",
        text: "And part of it is loyalty to the old plan. Imagining something different can feel like admitting the old dream is truly gone, and that can sting.",
      },
      {
        type: "p",
        text: "All of this is understandable. But staying in the blank space indefinitely has a cost. Without a sense of what you want, every day becomes something to get through rather than something to build.",
      },
      {
        type: "h2",
        text: "Start Smaller Than You Think",
      },
      {
        type: "p",
        text: 'The question "what do I want from my life?" is far too big to answer cold. It tends to produce either nothing at all or something so grand it feels out of reach.',
      },
      {
        type: "p",
        text: "So start smaller. Try questions like these.",
      },
      {
        type: "p",
        text: "What do I want more of this month? What do I want less of? When did I last lose track of time, and what was I doing? What did I set aside years ago that still tugs at me now and then? If nobody else's expectations mattered, what would I try first?",
      },
      {
        type: "p",
        text: "You are not looking for a perfect answer. You are looking for a thread to pull.",
      },
      {
        type: "quote",
        text: "Wanting is a skill, and like any skill, it gets rusty when it is not used.",
      },
      {
        type: "h2",
        text: "The Gift Hidden in the Blank Page",
      },
      {
        type: "p",
        text: "Here is something worth mulling over. The old plan was made by an earlier version of you, with less experience and fewer hard lessons behind them.",
      },
      {
        type: "p",
        text: "The person asking the question now knows more. You know what really matters to you, because a setback has a way of making that very clear. You know what you can survive. You know which parts of the old plan you were following out of habit rather than desire.",
      },
      {
        type: "p",
        text: "That is valuable knowledge. A plan built on it is likely to fit you far better than the one that came before.",
      },
      {
        type: "p",
        text: "People who rebuild after a setback often say the new direction suits them more than the old one ever did. Not because the setback was good, but because it forced a question they would never otherwise have asked.",
      },
      {
        type: "h2",
        text: "Let It Be a Sketch, Not a Blueprint",
      },
      {
        type: "p",
        text: "Whatever you come up with, hold it lightly at first. Think of it as a sketch rather than a blueprint. Something to test, adjust and redraw.",
      },
      {
        type: "p",
        text: "Try one small thing in the direction of what you want. See how it feels. Then adjust.",
      },
      {
        type: "p",
        text: "The point is not to lock in a new plan immediately. It is to start wanting again, and to let that wanting pull you forward.",
      },
      {
        type: "p",
        text: "So here is the question, and it is worth sitting with for a while. Now that the old plan is gone, what do you want?",
      },
      {
        type: "closing",
        text: "Setbacks don't get the last word.",
      },
    ],
  },
];

/** Today's date (YYYY-MM-DD) in South African time — the release clock. */
function todaySAST(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isPublished(post: Post, now: Date = new Date()): boolean {
  return !post.publishOn || post.publishOn <= todaySAST(now);
}

/** Public posts in series order (oldest first). */
export function publishedPosts(now: Date = new Date()): Post[] {
  return POSTS.filter((p) => isPublished(p, now));
}

/** A public post by slug; scheduled-but-not-yet-live posts return undefined. */
export function getPost(slug: string): Post | undefined {
  const post = POSTS.find((p) => p.slug === slug);
  return post && isPublished(post) ? post : undefined;
}

/** First paragraph of a post, used as the listing excerpt. */
export function excerpt(post: Post): string {
  return post.blocks.find((b) => b.type === "p")?.text ?? "";
}
