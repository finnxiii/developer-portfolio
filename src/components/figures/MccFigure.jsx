export default function MccFigure({ compact = false }) {
	return (
		<div className="mcc-figure">
			{!compact && (
				<div className="mcc-figure__toolbar">
					<span className="mcc-figure__filename">
						import_grades.csv · 5 rows · 2 changed · 1 new · 2 unchanged
					</span>
					<button className="mcc-figure__confirm-btn" tabIndex={-1} aria-hidden="true">
						Confirm import
					</button>
				</div>
			)}
			<div className="mcc-figure__scroll">
				<table className="mcc-figure__table" aria-label="Grade import difference view — illustrative data">
					<thead>
						<tr>
							<th scope="col">Status</th>
							<th scope="col">Grade</th>
							<th scope="col">Charge-out rate (£/hr)</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><span className="mcc-figure__status mcc-figure__status--new">New</span></td>
							<td>Graduate</td>
							<td>£38</td>
						</tr>
						<tr>
							<td><span className="mcc-figure__status mcc-figure__status--changed">Changed</span></td>
							<td>Senior</td>
							<td>
								<span className="mcc-figure__old">£105</span>
								{' → '}
								<span className="mcc-figure__new">£110</span>
							</td>
						</tr>
						<tr>
							<td><span className="mcc-figure__status mcc-figure__status--unchanged">Unchanged</span></td>
							<td>Junior</td>
							<td>£45</td>
						</tr>
						<tr>
							<td><span className="mcc-figure__status mcc-figure__status--unchanged">Unchanged</span></td>
							<td>Principal</td>
							<td>£150</td>
						</tr>
						<tr>
							<td><span className="mcc-figure__status mcc-figure__status--changed">Changed</span></td>
							<td>Mid</td>
							<td>
								<span className="mcc-figure__old">£72</span>
								{' → '}
								<span className="mcc-figure__new">£75</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
