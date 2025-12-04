using App.Application.Dto.Incidents;
using FluentValidation;

namespace App.Application.Validators
{
    public class CreateIncidentValidator : AbstractValidator<CreateIncidentRequest>
    {
        public CreateIncidentValidator()
        {
            RuleFor(x => x.StreetName).MaximumLength(255).NotEmpty();
            RuleFor(x => x.PhoneNumber).MaximumLength(11).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(255);
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(255);
            RuleFor(x => x.City).NotEmpty().MaximumLength(255);
            RuleFor(x => x.Coordinates).NotEmpty().NotNull();
            RuleFor(x => x.State).NotEmpty().MaximumLength(255);
            RuleFor(x => x.EventCategory).NotEmpty();
            RuleFor(x => x.EventDescription).NotEmpty().MaximumLength(255);
        }
    }
}
