import { useState, type FormEvent } from "react";
import { ArrowRight, CircleCheck, Compass, Layers3, Lightbulb, Mail } from "lucide-react";

const ideaTypes = [
  { value: "problem", label: "I’ve spotted a problem", prompt: "What happens today, and what makes it difficult?", icon: Compass },
  { value: "idea", label: "I have an idea", prompt: "What would you like the Lab to explore?", icon: Lightbulb },
  { value: "project", label: "I have a project underway", prompt: "What are you working on, and what would you like to improve?", icon: Layers3 },
] as const;
const steps = ["Your idea", "About you", "Verify email"] as const;

export function IdeasForm() {
  const [type, setType] = useState<(typeof ideaTypes)[number]["value"]>("problem");
  const [step, setStep] = useState(0);
  const activeType = ideaTypes.find(option => option.value === type) ?? ideaTypes[0];
  const fromWpu = new URLSearchParams(window.location.search).get("from") === "wpu";

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep(current => current + 1);
  }

  return <div className="ideas-layout">
    <aside className="ideas-guide">
      <h2>Submission steps</h2>
      <ol>
        {steps.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined}>
          <span className="ideas-step-marker" aria-hidden="true">{index < step ? <CircleCheck size={18}/> : index + 1}</span>
          {label}
        </li>)}
      </ol>
      {fromWpu && <p>Starting point<br/><a href="/projects/wpu-living-laboratory">The WPU Living Laboratory</a></p>}
    </aside>

    {step < 2 && <form className="idea-form" aria-label="Practice an idea submission" onSubmit={advance} autoComplete="off">
      <h2 key={step} tabIndex={-1} ref={element => { if (step === 1) element?.focus(); }}>{steps[step]}</h2>
      <fieldset className="idea-fields" hidden={step !== 0} disabled={step !== 0}>
        <fieldset className="idea-types">
          <legend>What would you like to share?</legend>
          <div className="idea-options">
            {ideaTypes.map(({ value, label, icon: Icon }) => <label className="idea-choice" key={value}>
              <input type="radio" name="idea-type" value={value} checked={type === value} onChange={() => setType(value)}/>
              <Icon aria-hidden="true" size={23}/>
              <span>{label}</span>
            </label>)}
          </div>
        </fieldset>
        <label>Short title <input required maxLength={100} placeholder="Give your idea a short, clear title"/></label>
        <label>{activeType.prompt} <textarea required rows={4} maxLength={1500}/></label>
        <label>Who would this help? <input required maxLength={300}/></label>
        {type === "project" && <label>What have you tried, and what help do you need? <textarea required rows={3} maxLength={1000}/></label>}
        <label>Supporting link <small>Optional</small><input type="url" placeholder="https://example.org"/></label>
      </fieldset>
      <fieldset className="idea-fields" hidden={step !== 1} disabled={step !== 1}>
        <p id="idea-contact-note">Use fictional details for this preview. In live intake, the Lab would use these details to credit your submission and follow up privately.</p>
        <div className="idea-input-pair">
          <label>Full name <input required maxLength={120} aria-describedby="idea-contact-note"/></label>
          <label>Email address <input type="email" required maxLength={254} aria-describedby="idea-contact-note"/></label>
        </div>
        <div className="idea-input-pair">
          <label>Your role <small>Optional</small><input maxLength={140} placeholder="Student, researcher or project lead"/></label>
          <label>Organisation <small>Optional</small><input maxLength={140}/></label>
        </div>
      </fieldset>
      <div className="idea-actions">
        {step === 1 && <button className="idea-back" type="button" onClick={() => setStep(0)}>Back to your idea</button>}
        <button type="submit">{step === 0 ? "Continue to your details" : "Continue to email verification"} <ArrowRight aria-hidden="true" size={18}/></button>
      </div>
    </form>}

    {step === 2 && <section className="idea-form idea-result" aria-labelledby="idea-verify">
      <Mail aria-hidden="true" size={30}/>
      <h2 id="idea-verify" tabIndex={-1} ref={element => element?.focus()}>Verify your email</h2>
      <p>In live intake, the Lab would send you a verification link. This preview simulates that step.</p>
      <button type="button" onClick={() => setStep(3)}>Simulate email verification</button>
    </section>}

    {step === 3 && <section className="idea-form idea-result" aria-labelledby="idea-confirmation">
      <CircleCheck aria-hidden="true" size={30}/>
      <h2 id="idea-confirmation" tabIndex={-1} ref={element => element?.focus()}>Practice submission complete</h2>
      <p>Your entries stayed in this browser tab. The Lab received nothing.</p>
      <button type="button" onClick={() => setStep(0)}>Try another example</button>
    </section>}
  </div>;
}
