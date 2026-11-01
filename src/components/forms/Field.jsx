export function Field({ id, label, error, hint, children, }) {
    return (<div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint ? (<p id={`${id}-hint`} className="mt-1 text-xs leading-5 text-muted">
          {hint}
        </p>) : null}
      {error ? (<p id={`${id}-error`} role="alert" className="mt-1 text-sm text-danger">
          {error}
        </p>) : null}
    </div>);
}
