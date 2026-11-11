import { useState, type FormEvent } from "react";

const ideaTypes = [
  { value: "problem", label: "I’ve spotted a problem", prompt: "What happens today, and what makes it difficult?" },
  { value: "idea", label: "I have an idea", prompt: "What would you like the Lab to explore?" },
  { value: "project", label: "I have a project underway", prompt: "What are you working on, and what would you like to improve?" },
] as const;

export function IdeasForm() {
  const [type, setType] = useState<(typeof ideaTypes)[number]["value"]>("problem");
  const [complete, setComplete] = useState(false);
  const activeType = ideaTypes.find(option => option.value === type) ?? ideaTypes[0];
  const source = new URLSearchParams(window.location.search).get("from");
  const fromWpu = source === "wpu";

  function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComplete(true);
  }

  if (complete) {
    return <section className="idea-form" aria-labelledby="idea-confirmation">
      <h2 id="idea-confirmation" tabIndex={-1} ref={element => element?.focus()}>Practice submission complete</h2>
      <p>Your entries stayed in this browser tab. The Lab received nothing.</p>
      <button type="button" onClick={() => setComplete(false)}>Try another example</button>
    </section>;
  }

  return (
    <form className="idea-form" aria-label="Practice an idea submission" onSubmit={preview} autoComplete="off">
      {fromWpu && <p className="notice">Starting point: <a href="/projects/wpu-living-laboratory">The WPU Living Laboratory</a></p>}
      <fieldset>
        <legend>What would you like to share?</legend>
        {ideaTypes.map(option => <label className="idea-choice" key={option.value}>
          <input type="radio" name="idea-type" value={option.value} checked={type === option.value} onChange={() => setType(option.value)}/>
          <span>{option.label}</span>
        </label>)}
      </fieldset>
      <label>Short title <input required maxLength={100} placeholder="A clearer way to explain the complaints process"/></label>
      <label>{activeType.prompt} <textarea required rows={4} maxLength={1500}/></label>
      <label>Who would this help? <input required maxLength={300}/></label>
      {type === "project" && <label>What have you tried, and what help do you need? <textarea required rows={3} maxLength={1000}/></label>}
      <label>Supporting link (optional) <input type="url" placeholder="https://example.org"/></label>
      <label>Example email <input type="email" value="contributor@example.org" readOnly/></label>
      <button type="submit">Preview confirmation</button>
    </form>
  );
}
