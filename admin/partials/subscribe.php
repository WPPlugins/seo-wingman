<div class="container">
	<div class="row">
		<div class="col-sm-6">
			<form name="subscribeForm" id="subscribeForm" data-ng-submit="subscribe()" novalidate>
				<div class="pg-wingman-subscribe">
					<h2>Subscription information</h2>
					<div class="pg-pad-20 ">

						<formly-form model="subscription" fields="fields.subscription">
							<div class="pg-mt-20">
								<button type="submit" class="wingman-btn" data-ng-show="!loading">Subscribe</button>
								<span data-ng-show="loading">Loading</span>
							</div>
							<messages messages="messages" class="pg-mt-20"></messages>
						</formly-form>

					</div>
				</div>
			</form>
		</div>

		<div class="col-sm-3">
			<wingman-plan data-plan="$root.plan" class="wingman-plan-single"></wingman-plan>
		</div>
	</div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="terms-and-conditions">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title">Privacy Policy</h4>
			</div>
			<div class="modal-body">
				<p>THIS PRIVACY POLICY (hereinafter “Policy”) sets forth the terms and conditions of SEO Wingman, LLC’s (“Wingman”) Search Engine Optimization service (the “Service”). By acknowledging this Policy, Customer acknowledges that Customer has read and understood this Policy and agrees to be bound by its terms.</p>
				<p><strong>A. Service Requirements</strong></p>
				<p>Customer understands and agrees that for Wingman to prove the Service to Customer, Wingman may:</p>
				<ol>
					<li>Make changes to Customer’s website content and underlying meta data;</li>
					<li>Submit Customer’s data to search engines and third party listing services;</li>
					<li>Create and modify sitemaps for Customer’s website; </li>
					<li>Access Google analytics and Google webmaster tools data; and/or</li>
					<li>Other related functions intended to improve Customer’s overall search results.</li>
				</ol>
				<p><strong>B. Payment</strong></p>
				<p>Customer understands and agrees that payment for the Service is due in advance and is not refundable.</p>
				<p><strong>C. Service Expectations; Limitation of Liability</strong></p>
				<p>Customer understands and agrees that, while the purpose of the Service is to improve Customer’s overall search results (including ranking position and traffic volume to Customer’s website), Wingman cannot guarantee that the Service will provide positive results as this is controlled by Google and other search engines companies.  </p>
				<p>EXCEPT AS EXPRESSLY SET FORTH HEREIN, WINGMAN DISCLAIMS ANY AND ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. CUSTOMER ACKNOWLEDGES AND AGREES THAT WINGMAN HAS MADE NO REPRESENTATIONS OR WARRANTIES RELATING TO THE EFFECTIVENESS OF THE SERVICE AND AGREES THAT WINGMAN SHALL NOT BE LIABLE UNDER ANY THEORY OR FORM OF ACTION (E.G., CONTRACT, BREACH OF WARRANTY, TORT, OR OTHERWISE) ARISING FROM OR RELATED IN ANY WAY TO THE RESULTS OF THE SERVICE.</p>
				<p>NOTWITHSTANDING ANY OTHER PROVISION OF THIS POLICY, UNDER NO CIRCUMSTANCES SHALL WINGMAN BE LIABLE TO CUSTOMER FOR ANY SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY NATURE WHATSOEVER, OR ANY INDIRECT DAMAGES, INCLUDING WITHOUT LIMITATION ANY DAMAGES RESULTING FROM INTERRUPTION OF BUSINESS OR LOSS OF PROFITS, REVENUES, DATA OR USE; LOSS OF SALES, REFERRALS, OR LEADS; OR ANY EXEMPLARY OR PUNITIVE DAMAGES ARISING OUT OF, OR IN CONNECTION WITH, ANY OBLIGATION HEREUNDER, EVEN THE OBLIGATED PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND REGARDLESS OF THE FORM OF THE ACTION (E.G., CONTRACT, BREACH OF WARRANTY, TORT, OR OTHERWISE). NOTHING IN THE FOREGOING SHALL BE CONSTRUED TO DENY OR DISPARAGE THE RIGHT OF EITHER PARTY TO RECOVER DAMAGES ARISING FROM THE GROSS NEGLIGENCE OR INTENTIONAL MISCONDUCT OF THE OTHER PARTY. THE FOREGOING NOTWITHSTANDING, UNDER NO CIRCUMSTANCES SHALL WINGMAN’S LIABILITY HEREUNDER EXCEED AMOUNTS PAID PURSUANT TO THIS AGREEMENT IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE CLAIM, LIABILITY, OR CAUSE OF ACTION FOR WHICH INDEMNITY IS SOUGHT PURSUANT TO THIS SECTION C.</p>
				<p><strong>D.	Miscellaneous</strong></p>
				<ol>
					<li>Force Majeure. Wingman shall not be held liable or responsible to each other, nor be deemed to have defaulted under or be in breach of this Policy, for failure or delay in fulfilling or performing any term of this Policy when such failure or delay is caused by, or results from, causes beyond Wingman’s reasonable control, including but not limited to fire, floods, failure, or termination of communications systems or networks, strikes, lockouts, or other labor disturbances, acts of God, or acts, omissions, or delays in acting by any governmental authority or the other party; provided, however, that Wingman shall use reasonable commercial efforts to avoid, mitigate, or remove such causes of nonperformance, and shall continue performance hereunder with reasonable dispatch whenever such causes are removed.</li>
					<li>In any litigation, arbitration, mediation, or other proceeding by which one party either seeks to enforce its rights under this Policy (whether in contract, tort, or both) or seeks a declaration of any rights or obligations under this Policy, the prevailing party shall be awarded its reasonable attorney fees, and costs and expenses incurred.</li>
					<li>If one or more provisions of this Policy are held to be unenforceable under applicable law, the parties agree to renegotiate such provision in good faith. In the event that the parties cannot reach a mutually agreeable and enforceable replacement for such provision, then (a) such provision shall be excluded from this Policy, (ii) the balance of this Policy shall be interpreted as if such provision were so excluded, and (iii) the balance of this Policy shall be enforceable in accordance with its terms.</li>
					<li>No waiver of any of the provisions of this Policy shall be deemed to or shall constitute a waiver of any other provision, whether or not similar, nor shall any waiver constitute a continuing waiver. Any waiver must be in writing and signed by the party entitled to performance.</li>
					<li>This Policy shall be governed by, and construed and enforced in accordance with, the laws of the Commonwealth of Kentucky, without regard to the conflicts of laws rules or principles thereof. The Courts of the Commonwealth of Kentucky, County of Jefferson, shall have jurisdiction over any dispute arising under this Policy. Customer hereby consents to personal jurisdiction in the courts of the Commonwealth of Kentucky, County of Jefferson, for purposes of any such dispute and waives any objection as to venue.</li>
				</ol>
				<p>By clicking “I AGREE”, Customer, intending to be legally bound, agrees to the terms of this Policy.</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="wingman-btn wingman-btn-small wingman-btn-act" data-dismiss="modal">Close</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->
